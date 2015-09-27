(function (window, angular, undefined) {

    'use strict';

    angular
        .module('sgAppAdmin')
        .service('sgLayoutActions', sgLayoutActions);

    sgLayoutActions.$inject = ['$q', 'sgUsers', 'sgLayouts', 'sgLayoutModals', 'sgMessages'];

    function sgLayoutActions($q, sgUsers, sgLayouts, sgLayoutModals, sgMessages) {
        // ==== DECLARATION =====
        var svc = this;

        _.extend(svc, {
            // first button actions
            assignDoer, acceptJob, approveJob, returnToUnrated,
            // second button actions
            uploadFiles, downloadFiles, editLayout,
            // third buttons actions
            moveToTrash, restoreFromTrash, revertGood,
            // additional buttons actions
            switchShopVisibility, addComment
        });

        var curUser = sgUsers.currentUser;

        function assignDoer(layout) {
            var setObject;
            var doSendEmail;

            sgLayoutModals.assignDoer(layout)
                .then((response) => {
                    if (response.dismissed) {
                        setObject = {
                            dismissedBy: curUser.name,
                            dismissedAt: new Date(),
                            dismissedComment: response.comment || '',
                            status: 'dismissed'
                        }
                    } else {
                        setObject = {
                            assignedTo: response.assignedTo,
                            assignedBy: curUser.name,
                            assignedAt: new Date(),
                            assignedComment: response.comment || "",
                            status: 'assigned'
                        };
                    }

                    doSendEmail = response.sendEmail;
                    // TODO: error reporting
                    // don't forget to destroy listeners on close
                    return sgLayouts.update(layout._id, setObject);

                })
                .then((result) => {
                    var message = {
                        fromUser: setObject.assignedBy,
                        toUser: setObject.assignedTo,
                        type: 'designer',
                        subType: 'jobAssigned',
                        header: 'Новое задание',
                        body: layout._id
                    };

                    if (result.data && result.data.layout) {
                        layout.reference = result.data.layout.reference;
                        layout.urlDir = result.data.layout.urlDir;
                    }
                    _.extend(layout, setObject);
                    return sgMessages.create(message);
                })
                .then(() => {
                    if (doSendEmail) {
                        var mail = {
                            to: sgUsers.getMail(setObject.assignedTo),
                            subject: "Новое задание",
                            template: 'designer-newTask'
                        };

                        var vars = {
                            sender: curUser.name,
                            comment: setObject.assignedComment
                        };
                        return sgMessages.eMail(mail, vars);
                    }
                });
        }

        function acceptJob(layout) {

            var setObject;

            sgLayoutModals.acceptReject(layout)
                .then((response) => {
                    setObject = {
                        status: response.rejected
                            ? "rejected"
                            : "accepted",
                        acceptedAt: new Date(),
                        acceptedComment: response.comment
                    };
                    return sgLayouts.update(layout._id, setObject);
                })
                .then(() => {
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

                    _.extend(layout, setObject);
                    return $q.all([sgMessages.create(designerMessage), sgMessages.create(adminMessage)]);
                });

        }

        function approveJob(layout) {
            var setObject;
            var doSendEmail;
            sgLayoutModals
                .approveDecline(layout)
                .then((response) => {
                    doSendEmail = response.sendEmail;

                    if (response.declined) {
                        setObject = {
                            status: "assigned",
                            assignedBy: curUser.name,
                            assignedComment: response.comment
                        }
                    } else {
                        setObject = {
                            status: "approved",
                            approvedBy: curUser.name,
                            approvedAt: new Date(),
                            approvedComment: response.comment
                        };
                    }

                    return sgLayouts.update(layout._id, setObject);

                })
                .then(() => {
                    _.extend(layout, setObject);
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

        function revertGood(layout) {
            var header = 'Возврат на доработку';
            var message = 'Вы хотите вернуть этот товар из магазина на доработку?';
            var setObject = {
                status: 'assigned'
            };

            sgLayoutModals
                .revert(layout, header, message, true)
                .then((response)=> {
                    return response.comment
                        ? sgLayouts.addComment(layout, response.comment)
                        : true;
                })
                .then(()=> sgLayouts.update(layout._id, setObject)) // change status
                .then(()=> {
                    _.extend(layout, setObject);                    // update loaded layout
                    var message = {                                 // and send message
                        fromUser: curUser.name,
                        toUser: layout.assignedTo,
                        type: 'designer',
                        subType: 'jobAssigned',
                        header: 'Макет возвращён на доработку',
                        body: layout._id
                    };

                    return sgMessages.create(message);
                });
        }

        function uploadFiles(layout) {
            sgLayoutModals
                .uploadFiles(layout)
                .then((response) => {
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
            var setObject;
            sgLayoutModals
                .edit(layout)
                .then((layoutClone)=> {
                    setObject = {
                        name: layoutClone.name,
                        catColors: layoutClone.catColors,
                        catPlots: layoutClone.catPlots,
                        catAssortment: layoutClone.catAssortment,
                        catCountries: layoutClone.catCountries
                    };

                    return sgLayouts.update(layout._id, setObject);
                })
                .then(()=> {
                    _.extend(layout, setObject);
                });
        }

        function moveToTrash(layout) {
            var header = '<span class="sg-red-i">Удаление изображения</span>';
            var message = 'Вы хотите удалить это изображение в корзину?';
            sgLayoutModals.remove(layout, header, message)
                .then(()=> sgLayouts.remove(layout['_id']))
                .then(()=> {
                    svc.unselectLayout(); // hack! Imported from gallery via sgLayoutToolbar
                    layout.status = "deleted"; // controller's scope
                });
        }

        function restoreFromTrash(layout) {
            var header = 'Восстановление изображения';
            var message = 'Вы хотите восстановить это изображение?';

            sgLayoutModals
                .restore(layout, header, message)
                .then(()=> sgLayouts.restore(layout['_id']))
                .then(()=> {
                    delete layout.status;
                });
        }

        function returnToUnrated(layout) {
            var header = 'Вернуть изображение';
            var message = 'Вы хотите вернуть это изображение в список загруженных';
            sgLayoutModals
                .restore(layout, header, message)
                .then(()=> sgLayouts.update(layout._id, {}, ['status']))
                .then(()=> {
                    delete layout.status;
                });
        }

        function switchShopVisibility(layout) {
            var header = 'Доступность в магазине';
            var message = layout.isPublished
                ? 'Скрывать данный товар?'
                : 'Показывать данный товар';
            sgLayoutModals
                .shopVisibility(layout, header, message, true)
                .then((response)=> {
                    return response.comment
                        ? sgLayouts.addComment(layout, response.comment)
                        : true;
                })
                .then(()=>sgLayouts.update(layout._id, {isPublished: !layout.isPublished}))
                .then(()=> {
                    layout.isPublished = !layout.isPublished;
                });
        }

        function addComment(layout) {
            sgLayoutModals
                .addLayoutComment(layout)
                .then((commentText)=> sgLayouts.addComment(layout, commentText));
        }

    }

})(window, window.angular);