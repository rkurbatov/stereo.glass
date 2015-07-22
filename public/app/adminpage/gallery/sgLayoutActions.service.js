(function (window, angular, undefined) {

    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutActions', sgLayoutActions);

    sgLayoutActions.$inject = ['sgUsers', 'sgLayouts', 'sgLayoutModals', 'sgMessages', '$q'];

    function sgLayoutActions(sgUsers, sgLayouts, sgLayoutModals, sgMessages, $q) {

        // ==== DECLARATION =====
        var svc = this;

        svc.assignDoer = assignDoer;
        svc.acceptJob = acceptJob;
        svc.approveJob = approveJob;
        svc.uploadFiles = uploadFiles;
        svc.downloadFiles = downloadFiles;
        svc.editLayout = editLayout;
        svc.moveToTrash = moveToTrash;
        svc.restoreFromTrash = restoreFromTrash;

        var name = sgUsers.currentUser.name;
        var role = sgUsers.currentUser.role;

        function assignDoer(layout) {

            var setObject;
            var doSendEmail;

            sgLayoutModals.assignDoer(layout)
                .then(function (response) {
                    setObject = {
                        assignedTo: response.assignedTo,
                        assignedBy: name,
                        assignedAt: new Date(),
                        assignedComment: response.comment || "",
                        status: 'assigned'
                    };
                    doSendEmail = response.sendEmail;
                    // TODO: error reporting
                    // don't forget to destroy listeners on close
                    return sgLayouts.update(layout._id, setObject);

                })
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
                    if (doSendEmail) {
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
        }

        function acceptJob(layout) {

            var setObject;

            sgLayoutModals.acceptReject(layout)
                .then(function (response) {

                    setObject = {
                        status: response.rejected
                            ? "rejected"
                            : "accepted",
                        acceptedAt: new Date(),
                        acceptedComment: response.comment
                    };

                    return sgLayouts.update(layout._id, setObject);

                })
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

        }

        function approveJob(layout) {
            var setObject;
            var doSendEmail;
            sgLayoutModals.approveDecline(layout)
                .then(function (response) {
                    doSendEmail = response.sendEmail;

                    if (response.declined) {
                        setObject = {
                            status: "assigned",
                            assignedBy: sgUsers.currentUser.name,
                            assignedComment: response.comment
                        }
                    } else {
                        setObject = {
                            status: "approved",
                            approvedBy: sgUsers.currentUser.name,
                            approvedAt: new Date(),
                            approvedComment: response.comment
                        };
                    }

                    return sgLayouts.update(layout._id, setObject);

                })
                .then(function (result) {

                    _.extend(layout, setObject);
                    console.log(layout);
                    var message;

                    if (setObject.status === "approved") {
                        message = {
                            fromUser: setObject.approvedBy,
                            toUser: setObject.assignedTo,
                            type: 'designer',
                            subType: 'jobApproved',
                            header: 'Работа принята',
                            body: layout._id
                        };
                    } else {
                        message = {
                            fromUser: setObject.assignedBy,
                            toUser: setObject.assignedTo,
                            type: 'designer',
                            subType: 'jobAssigned',
                            header: 'Работа назначена повторно',
                            body: layout._id
                        };
                    }


                    return sgMessages.create(message);

                });
        }

        function uploadFiles(layout) {
            sgLayoutModals.uploadFiles(layout)
                .then(function (response) {
                    var setObject = {
                        status: 'finished',
                        finishedAt: new Date(),
                        responseComment: response.comment
                    };
                    sgLayouts.update(layout._id, setObject)
                        .then(function () {
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

        function downloadFiles(layout) {
            sgLayoutModals.downloadFiles(layout);
        }

        function editLayout(layout) {

        }

        function moveToTrash(layout) {
            var header = '<span class="sg-red-i">Удаление изображения</span>';
            var message = 'Вы хотите удалить это изображение в корзину?';
            sgLayoutModals.remove(layout, header, message)
                .then(function () {
                    sgLayouts.remove(layout['_id']).then(function () {
                        // hack! Imported from paginator via sgLayoutToolbar controller's scope
                        svc.unselectLayout();
                        layout.isHidden = true;
                    });
                });
        }

        function restoreFromTrash(layout) {
            var header = 'Восстановление изображения';
            var message = 'Вы хотите восстановить это изображение?';
            sgLayoutModals.restore(layout, header, message)
                .then(function () {
                    sgLayouts.restore(layout['_id']).then(function () {
                        layout.isHidden = false;
                    });
                });
        }
    }

})(window, window.angular);