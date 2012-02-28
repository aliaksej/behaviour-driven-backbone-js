describe('Backbone.Behaviour', function () {
    var bc, View;

    bc = Backbone.Behaviour.extend({
        prop1: 123,
        prop2: 123,
        beforeInit: function (owner) {
            return true;
        },
        afterInit: function (owner) {
            return true;
        },
        destroy: function (owner) {
            return true
        }
    });

    window.bc = bc;

    View = Backbone.View.extend({
        behaviours: {
            str: 'bc',
            func: bc
        }
    });

    it('tests Backbone.Behaviour functions and properties existence', function () {
        expect(Backbone.Behavioural).toBeDefined();
        expect(Backbone.Behavioural.setBehaviours).toBeDefined();
        expect(Backbone.Behavioural.initBehaviours).toBeDefined();
        expect(Backbone.Behavioural.initBehaviour).toBeDefined();
        expect(Backbone.Behavioural.triggerBehaviours).toBeDefined();
        expect(Backbone.Behavioural.bindTriggers).toBeDefined();
        expect(Backbone.Behavioural.behaviours).toBeUndefined();
        expect(Backbone.Behavioural._behaviours).toBeUndefined();
        expect(Backbone.Behavioural._behaviourTrackableEvents).toBeDefined();
    });

    it('tests Backbone.Behaviour component and it\'s methods', function () {
        expect(Backbone.Behaviour).toBeDefined();
        expect(Backbone.Behaviour.extend).toBeDefined();

        var b = new Backbone.Behaviour();

        expect(b).toBeDefined();
        expect(b.extend).toBeUndefined();
        //expect(b.constructor).toBeDefined();
        expect(b.constructor).toBeDefined();
    });

    it('creates new Behaviour with default functionality and tests it', function () {
        var pr = bc.prototype;

        expect(pr.afterInit).toBeDefined();
        expect(pr.beforeInit).toBeDefined();
        expect(pr.destroy).toBeDefined();
    });

    describe('tests Backbone.View behaviour driven component', function () {

        beforeEach(function () {
            window.onHello = function () {
                return 'Hello';
            };
            window.afterInitTrigger = function () {
                return true;
            };

            spyOn(window, 'onHello');
            spyOn(window, 'afterInitTrigger');

            this.view = new View({
                triggers: {
                    afterInit: window.afterInitTrigger,
                    onHello: window.onHello
                }
            });
        });

        expect(Backbone.View).toBeDefined();
        expect(Backbone.View.extend).toBeDefined();
        expect(Backbone.View.extend).toEqual(Backbone.View.extend);


        it ('tests Behaviour.triggers functionality', function () {
            var view = this.view;

            expect(view).toBeDefined();

            expect(view._callbacks.onHello).toBeDefined();
            expect(view._callbacks.afterInit).toBeDefined();

            // default event triggers must be executed on object creation
            expect(afterInitTrigger).toHaveBeenCalled();

            // trigger custom event handler
            view.trigger('onHello');
            expect(onHello).toHaveBeenCalled();
        });

        it('tests behaviours initialization and functionality', function () {
            var view = this.view;

            expect(view.behaviours).toBeDefined();
            expect(view._behaviours).toBeDefined();
            expect(view._behaviourTrackableEvents).toBeDefined();

            // check view has handlers for behaviour trackable events
            $.each(view._behaviourTrackableEvents, function (i, event) {
                expect(view._callbacks[event]).toBeDefined();
            });

            expect(view._behaviours.str).toBeDefined();
            expect(view._behaviours.func).toBeDefined();

            // spy on trigger calls
            expect(view._behaviours.str.beforeInit).toBeDefined();
            spyOn(view._behaviours.str, 'afterInit');
            view.trigger('afterInit');
            expect(view._behaviours.str.afterInit).toHaveBeenCalled();
        });
    });
});