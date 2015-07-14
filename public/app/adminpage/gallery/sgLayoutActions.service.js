(function(){

    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutActions', sgLayoutActions);

    sgLayoutActions.$inject = ['sgUsers', 'sgLayouts', 'sgLayoutControls', 'sgMessages', '$q'];

    function sgLayoutActions(sgUsers, sgLayouts, sgLayoutControls, sgMessages, $q) {

        // ==== DECLARATION =====
        var svc = this;

        svc.assignDoer = assignDoer;
        svc.acceptJob = acceptJob;
        svc.uploadFiles = uploadFiles;
        svc.downloadFiles = downloadFiles;
        svc.editLayout = editLayout;
        svc.confirmRemove = confirmRemove;

        var name = sgUsers.currentUser.name;
        var role = sgUsers.currentUser.role;

        function assignDoer(layout) {
            sgLayoutControls.modalAssignDoer(layout)
                .then(function (response) {
                    var setObject = {
                        assignedTo: response.assignedTo,
                        assignedBy: name,
                        assignedAt: new Date(),
                        assignedComment: response.comment || "",
                        status: 'assigned'
                    };

                    // TODO: error reporting
                    // don't forget to destroy listeners on close
                    return sgLayouts.update(layout._id, setObject)
                        .then(function (result) {
                            if (result.data && result.data.layout) {
                                layout.reference = result.data.layout.reference;
                                layout.urlDir = result.data.layout.urlDir;
                            }
                            _.extend(layout, setObject);
                            var message = {
                                fromUser: setObject.assignedBy,
                                toUser: setObject.assignedTo,
                                type: 'designer',
                                subType: 'jobAssigned',
                                header: 'Новое задание',
                                body: layout._id
                            };
                            return sgMessages.create(message);
                        })
                        .then(function () {
                            if (response.sendEmail) {
                                var mail = {
                                    to: sgUsers.getMail(setObject.assignedTo),
                                    subject: "Новое задание",
                                    template: 'designer-newTask'
                                };

                                var vars = {
                                    sender: sgUsers.currentUser.name,
                                    comment: setObject.assignedComment
                                };
                                return sgMessages.eMail(mail, vars);
                            }
                        });
                });
        }

        function acceptJob(layout) {
            sgLayoutControls.modalAccept(layout)
                .then(function (response) {
                    var setObject = {
                        status: response.rejected
                            ? "rejected"
                            : "accepted",
                        acceptedDate: new Date(),
                        acceptedComment: response.comment
                    };
                    sgLayouts.update(layout._id, setObject)
                        .then(function () {
                            _.extend(layout, setObject);
                            var designerMessage = {
                                fromUser: "Stereo.Glass",
                                toUser: layout.assignedTo,
                                type: 'designer',
                                subType: 'jobAssigned',
                                header: 'Задание принято вами в работу',
                                body: layout._id
                            };

                            var adminMessage = {
                                fromUser: layout.assignedTo,
                                toUser: layout.assignedBy,
                                type: 'designer',
                                subType: 'jobAccepted',
                                header: 'Задание принято ' + layout.assignedTo + ' в работу',
                                body: layout._id
                            };

                            return $q.all([sgMessages.create(designerMessage), sgMessages.create(adminMessage)]);
                        });
                });

        }

        function uploadFiles(layout) {
            sgLayoutControls.modalFinishJob(layout)
                .then(function (response) {
                    var setObject = {
                        status: 'finished',
                        responseComment: response.comment
                    };
                    sgLayouts.update(layout._id, setObject)
                        .then(function(){
                            _.extend(layout, setObject);
                            var adminMessage = {
                                fromUser: layout.assignedTo,
                                toUser: layout.assignedBy,
                                type: 'designer',
                                subType: 'jobFinished',
                                header: layout.assignedTo + ' завершил работу над макетом',
                                body: layout._id
                            };
                            sgMessages.create(adminMessage);
                        });
                });
        }

        function downloadFiles(layout){
            sgLayoutControls.modalDownloadFiles(layout);
        }

        function editLayout(layout) {

        }

        function confirmRemove(layout) {
            sgLayoutControls.modalRemove(layout)
                .then(function () {
                    sgLayouts.remove(layout['_id']).then(function () {
                        //TODO: Fix issue with unselection after layout delete
                        //vm.unselectLayout();
                        layout.isHidden = true;
                    });
                });
        }
    }

})();