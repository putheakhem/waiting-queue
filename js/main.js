/**
  By Mr KHEM Puthea
*/

/**
 * Variable to store timeout objects
 * @type {Array}
 */
var timeOuts = [];


/**
 * To clear all timeout objects
 */
var clearSystem = function () {
    _.each(timeOuts, function (ele) {
        clearTimeout(ele);
    });
    timeOuts = [];
};

/*
 client array
*/
var _clients = [
    ],
    waitingQue = [],
    servicing = null,
    duration = 150,
    timeUnit = 100;



/**
 * Use while loop to make time clock cycle
 */
var system = function ($scope) {
    var timing = duration;
    var timeUse = 0;
    var clients = _clients;
    var callBack = function (e) {
        $scope.$apply(function () {
            $scope.events.push(e);
        });
    };
    /**
     * Make the form of object store data of an event
     */
    var makeEvent = function (id, time, clientId, eventType, waitingQue, stateOfServer, eventState) {
        switch (eventType) {
            case 0:
                eventType = 'a';
                break;
            case 1:
                eventType = 'd';
                break;
            case 2:
                eventType = 'START';
                break;
            default :
                eventType = 'STOP'
        }
        return {
            id: id,
            time: time,
            clientId: clientId,
            eventType: eventType,
            waitingQue: waitingQue,
            stateOfServer: stateOfServer,
            eventState: eventState
        }
    };
    /**
     * This is method to get event state
     * @returns {string}
     */
    var getEventState = function (stop) {
        //return '(19,1,d), (25,2,a), (150,-,Stop)';
        var arrive = '', leave = '', a = 0, l = 0;
        if (clients.length > 0) {
            var client = clients[0];
            a = client._dInterArrive;
            arrive = '(' + (client._dInterArrive + timeUse) + ',' + client.id + ',a' + '), ';
        }
        if (servicing != null) {
            client = servicing;
            l = client.dService;
            leave = '(' + (client.dService + timeUse) + ',' + client.id + ',d' + '), ';
        }
        return (a < l ? (arrive + leave) : (leave + arrive)) + (stop ? '' : '(' + duration + ',-,Stop)');
    };
    /**
     * Init start event
     */
    $scope.events.push(makeEvent(0, 0, '-', 2, waitingQue.length, servicing == null ? 0 : 1, getEventState()));
    /**
     * Clear old system timeout
     */
    clearSystem();
    while (--timing >= 0) {
        /**
         * User setTimeout method to delay time
         * By depending on timeUnit variable
         */
        var to = setTimeout(function () {
            /**
             * Making time storing
             */
            timeUse += 1;
            /**
             * Block service process
             */
            checkService();
            /**
             * Block clients process
             */
            if (clients.length > 0) {
                //Decrement duration inter-arrive
                clients[0].dInterArrive -= 1;
                if (clients[0].dInterArrive == 0) {
                    var client = clients[0];
                    arriveEvent();
                    eventOccur(0, client);
                }
            }

            if (timeUse == duration) {
                callBack(makeEvent(eventId, timeUse, '-', 3, waitingQue.length, servicing == null ? 0 : 1, getEventState(true)));
            }
        }, timeUnit * (duration - timing));
        timeOuts.push(to);
    }

    /**
     * When duration inter-arrive of client is time
     * Shift out one from clients and put its id and duration of service to waiting que
     */
    var arriveEvent = function () {
        var client = clients.shift();
        waitingQue.push({id: client.id, dService: client.dService});
        checkService(true);
    };

    /**
     * Check server weather it free
     * Or decrement time of client is being serviced
     */
    var checkService = function (arr) {
        /**
         * If server if free
         */
        if (servicing == null) {
            if (waitingQue.length > 0) {
                servicing = waitingQue.shift();
            }
        } else if (!arr) {
            servicing.dService -= 1;
            if (servicing.dService == 0) {
                var sv = servicing;
                servicing = null;
                checkService();
                eventOccur(1, sv);
            }
        }
    };

    /**
     * When an event occur, new push report have to do
     */
    var eventId = 1;
    var eventOccur = function (eventType, client) {
        //console.log('Event-type: ' + (eventType == 0 ? 'arrive' : 'leave') + '. ' +
        //'ClientId: ' + (client.id) + '. ' +
        //'Time: ' + (timeUse) + '. ' +
        //'Waiting-length: ' + (waitingQue.length));
        var eventState = getEventState();
        var time = timeUse - (client.dInterArrive ? client.dInterArrive : 0);
        callBack(makeEvent(eventId, time, client.id, eventType, waitingQue.length, servicing == null ? 0 : 1, eventState));
        eventId++;
    };
};
