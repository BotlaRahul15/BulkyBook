/*======================================================================================================
*   Name        : Workflow Enduser js file
*   Description : All the Scripts that are written for Workflow would come into this file
*   Author      : Rahul
*   Created on  : 6th Feb,2019
*
*  Add this file in all the view files in the Workflow Enduser Area
=========================================================================================================*/

/*************************************************Workspace Section***************************************/
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "ce_datetime-asc": function (a, b) {

        var x, y;
        if (jQuery.trim(a) !== '') {
            var deDatea = jQuery.trim(a).split(' ');
            var deTimea = deDatea[1].split(':');
            var deDatea2 = deDatea[0].split('-');
            if (typeof deTimea[2] !== 'undefined') {
                x = (deDatea2[2] + ConvertMonthsToNumber(deDatea2[1]) + deDatea2[0] + deTimea[0] + deTimea[1] + deTimea[2]) * 1;
            } else {
                x = (deDatea2[2] + ConvertMonthsToNumber(deDatea2[1]) + deDatea2[0] + deTimea[0] + deTimea[1]) * 1;
            }
        } else {
            x = -Infinity; // = l'an 1000 ...
        }

        if (jQuery.trim(b) !== '') {
            var deDateb = jQuery.trim(b).split(' ');
            var deTimeb = deDateb[1].split(':');
            deDateb = deDateb[0].split('-');
            if (typeof deTimeb[2] !== 'undefined') {
                y = (deDateb[2] + ConvertMonthsToNumber(deDateb[1]) + deDateb[0] + deTimeb[0] + deTimeb[1] + deTimeb[2]) * 1;
            } else {
                y = (deDateb[2] + ConvertMonthsToNumber(deDateb[1]) + deDateb[0] + deTimeb[0] + deTimeb[1]) * 1;
            }
        } else {
            y = -Infinity;
        }
        var z = ((x < y) ? -1 : ((x > y) ? 1 : 0));
        return z;
    },

    "ce_datetime-desc": function (a, b) {

        var x, y;
        if (jQuery.trim(a) !== '') {
            var deDatea = jQuery.trim(a).split(' ');
            var deTimea = deDatea[1].split(':');
            var deDatea2 = deDatea[0].split('-');
            if (typeof deTimea[2] !== 'undefined') {
                x = (deDatea2[2] + ConvertMonthsToNumber(deDatea2[1]) + deDatea2[0] + deTimea[0] + deTimea[1] + deTimea[2]) * 1;
            } else {
                x = (deDatea2[2] + ConvertMonthsToNumber(deDatea2[1]) + deDatea2[0] + deTimea[0] + deTimea[1]) * 1;
            }
        } else {
            x = -Infinity;
        }

        if (jQuery.trim(b) !== '') {
            var deDateb = jQuery.trim(b).split(' ');
            var deTimeb = deDateb[1].split(':');
            deDateb = deDateb[0].split('-');
            if (typeof deTimeb[2] !== 'undefined') {
                y = (deDateb[2] + ConvertMonthsToNumber(deDateb[1]) + deDateb[0] + deTimeb[0] + deTimeb[1] + deTimeb[2]) * 1;
            } else {
                y = (deDateb[2] + ConvertMonthsToNumber(deDateb[1]) + deDateb[0] + deTimeb[0] + deTimeb[1]) * 1;
            }
        } else {
            y = -Infinity;
        }
        var z = ((x < y) ? 1 : ((x > y) ? -1 : 0));
        return z;
    }
});
function ConvertMonthsToNumber(mon) {
    return moment().month(mon).format("MM");
}
$.ajaxSetup({
    beforeSend: function (jqXHR, Obj) {
        var token = $('input[name="__RequestVerificationToken"]').val();
        if (token) {
            jqXHR.setRequestHeader("__RequestVerificationToken", token);
        }
    }
});

var DashboardWorkspace;
var recordsearch = "load";
var SearchColumnName;
var SearchString;
var DashboardWorkitem;
var WebURL;
var WorkspaceEnduser;
var Mode;
var rows_selected = [];
var myDataProcessor;
var DashboardWorkflow;
var DashboardTasks;
var SaveMode;
var ActivateWorkspace;
var DeactivateWorkspace;
var LinkTitle;
var UnLinkTitle;
var UserPrivilege;
var RefreshData;
var IsLinkedToBookId;
var ResourceList = [];
var Workspace = {
    init: function (args) {
        WebURL = args.Url;
        Mode = args.Mode;
        WorkspaceEnduser = args.WorkspaceEndUser;
        UserPrivilege = args.UserPrivilege;
        this.LoadUserPrivileges(UserPrivilege);
        if (Mode == "EditWorkspace") {
            $("#DrpWorkspaceTemplate").prop("disabled", 'disabled');
            $("#AddWSWIRel").removeClass("hide");
            this.loadWIRelationGrid();
        }
        if (Mode == "ViewWorkspace") {
            $("#WSinstanceName ,#WSinstanceDesc ,#WSInstanceStatus ,#DrpWorkspaceTemplate ,#WSInstNotes ,.odd_material ,.ev_material ").attr('disabled', true);
            $("#btnCancelWSInstance").css("display", "none");
            $("#btnbackWSInstance").removeClass("hide");
            $("#btnSaveWSInstance").hide();
            $("#btnClose").removeClass("hide");
            $("#AddWSWIRel").hide();
            $("#btnEdit").removeClass("hide");
            $("#NewWSWILink").addClass("hide");
            $('.ActivateDeactivatetooltipWS').removeAttr('title');
            this.loadWIRelationGrid();
            //WIRelationTreeGrid.setEditable(false);
        }

        if (WorkspaceEnduser != null) {
            $('#WIInstanceLIst th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') == true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var SearchId = id + 'SearchField';
                    // var InputSearchbox = '<input type="text" class="form-control textbox" id="' + SearchId + '" placeholder="Search by ' + title + '" />';
                    var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            $('#WIInstanceLIst th').hide();
        }
        this.SaveWSInstance();

        // rows_selected = WorkspaceEnduser.SelectedWorkitemIds;   
    },

    LoadUserPrivileges: function (UserPrivilege) {
        if (UserPrivilege !== null && UserPrivilege !== undefined) {
            if (UserPrivilege.ActivateWorkspace === true) {
                ActivateWorkspace = true;
            }
            else {
                ActivateWorkspace = false;
            }
            if (UserPrivilege.DeactivateWorkspace === true) {
                DeactivateWorkspace = true;
            }
            else {
                DeactivateWorkspace = false;
            }

        }
    },

    SaveWSInstance: function (e) {
        $('.btnSaveWSInstance').click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var res = WSInstanceCreateEditValidatons();
            if (res == true) {
                var WorkspaceInst = $("#WSinstanceName").val().trim();
                var selectedTaggedUsers = $("#drpTaggedUsers").val();
                if (selectedTaggedUsers != null) {
                    var selectedIds = selectedTaggedUsers.toString().split(',');
                }
                var taggedUsers = [];
                taggedUsers = $("#drpTaggedUsers").data("kendoMultiSelect").options.dataSource;
                for (var id in selectedIds) {
                    for (var item in taggedUsers) {
                        if (selectedIds[id] == taggedUsers[item].UserID) {
                            taggedUsers[item].IsUserTaggedSelected = true;
                            break;
                        }
                    }
                }
                var data = $(".createWSInstanceForm").serialize() + '&' + $.param({ taggedUsers: JSON.stringify(taggedUsers) }, true);
                $.ajax('CreateWorkspaceEndUser', {
                    type: 'POST',  // http method
                    data: data,  // data to submit
                    success: function (data, status, xhr) {
                        if (data == true) {
                            RedirectUrl = WebURL + 'WorkspaceEnduser/Success?ActiveTab=WorkspaceInfo';
                            window.location.replace(RedirectUrl);
                        } else if (data == "Conflict") {
                            var message = Web_WorkSpaceAlreadyExistsSameNameCantBeCreated.replace("{0}", WorkspaceInst);
                            $('#WorkspaceEditSuccessMsg').removeClass('hide');
                            $('#WorkspaceEditSuccessMsg').addClass('text-danger');
                            $('#WorkspaceEditSuccessMsg').html(message);
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WorkspaceEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                        else {
                            message = Web_WorkspaceCannotCreate.replace("{0}", WorkspaceInst);
                            $('#WorkspaceEditSuccessMsg').removeClass('hide');
                            $('#WorkspaceEditSuccessMsg').addClass('text-danger');
                            $('#WorkspaceEditSuccessMsg').html(message);
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WorkspaceEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                    }
                });
            } else {
                return false;
            }
        });

        $('.btnUpdateWSInstance').click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var res = WSInstanceCreateEditValidatons();
            if (res === true) {
                var WorkspaceInst = $("#WSinstanceName").val().trim();
                //var data = $("#createWSInstanceForm").serialize();
                var selectedTaggedUsers = $("#drpTaggedUsers").val();
                if (selectedTaggedUsers != null) {
                    var selectedIds = selectedTaggedUsers.toString().split(',');
                }
                var taggedUsers = [];
                taggedUsers = $("#drpTaggedUsers").data("kendoMultiSelect").options.dataSource;
                for (var id in selectedIds) {
                    for (var item in taggedUsers) {
                        if (selectedIds[id] == taggedUsers[item].UserID) {
                            taggedUsers[item].IsUserTaggedSelected = true;
                            break;
                        }
                    }
                }
                var data = $(".createWSInstanceForm").serialize() + '&' + $.param({ taggedUsers: JSON.stringify(taggedUsers) }, true);
                //contains strin g array of all the ids that havebeen checked
                //   WIRelationTreeGrid._h2.forEachChild(0, function (el) { if (el != null) if (WIRelationTreeGrid.cells(el.Id, 5).getValue() != 0) Allrelateditmes.push(Id); });
                //  var relatedList = Allrelateditmes.toString(); 

                $.ajax('UpdateWorkspace', {
                    type: 'POST',  // http method
                    data: data,  // data to submit                    
                    //data: { str: GridTreeSerialization },
                    //dataType:'json',
                    //contentType:"application/json",
                    success: function (data, status, xhr) {

                        if (data === true) {
                            //need to map to resource file 
                            //ShowWorkspaceUpdateSuccess(WorkspaceInst);
                            var message = Web_WorkspaceInstUpdateSuccess.replace("{0}", WorkspaceInst);
                            $('#WorkspaceEditSuccessMsg').removeClass('hide');
                            $('#WorkspaceEditSuccessMsg').addClass('txtcolourforestgreen');
                            $('#WorkspaceEditSuccessMsg').html(message);
                            window.scrollTo(0, 0);
                            //setTimeout(function () { $("#WorkspaceEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        }
                        else {
                            var msg = data.indexOf("Concurrency") >= 0 ? Web_ProblemInWorkItemUpdate : Web_WorkspaceInstancecantbeUpdated.replace("{0}", WorkspaceInst);
                            $('#WorkspaceEditSuccessMsg').removeClass('txtcolourforestgreen');
                            $('#WorkspaceEditSuccessMsg').removeClass('hide');
                            $('#WorkspaceEditSuccessMsg').addClass('text-danger');
                            $('#WorkspaceEditSuccessMsg').html(msg);
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WorkspaceEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                    }
                });
            }
            else {
                return false;
            }

            $('.WorkSpaceUpdateOk').on('click', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=WorkspaceInfo';
                window.location.replace(RedirectUrl);
            });


        });

    },
    loadWIRelationGrid: function () {
        var data = WorkspaceEnduser.wirelationship;
        //// var service = "https://demos.telerik.com/kendo-ui/service";
        $("#gridbox").html('');
        $("#gridbox").kendoTreeList({
            dataSource: {
                data: data,
                schema: {
                    model: {
                        id: "id",
                        parentId: "parentId",
                        fields: {
                            parentId: { field: "parent", nullable: true },
                            id: { field: "id", type: "string" }
                        },
                        expanded: true
                    }
                }
            },
            height: 540,
            filterable: {
                extra: false
            },
            sortable: true,
            columns: [
                {
                    field: "WorkitemTemplateName", title: "Work item template", width: 170
                },
                {
                    field: "WorkitemInstanceId", title: "Id", width: 60
                },
                {
                    field: "WorkitemInstanceName", title: "Work item name", width: 120,
                    template: function (cell) {
                        return '<a style="cursor: pointer;" class="WorkitemInstnaceNameLink linkcolour">' + cell.WorkitemInstanceName + '</a>';
                    }
                },
                {
                    field: "RelatedWorkspaceName", title: "Workspace", width: 120,
                    template: function (cell) {
                        //return '<a style="cursor: pointer;" class="ViewRelatedWorkspaceLink linkcolour">' + cell.RelatedWorkspaceName + '</a>';
                        return cell.RelatedWorkspaceName;
                    }
                },
                { field: "StatusName", title: "Status", width: 70 },
                {
                    field: "IsAssociatedtoOtherWorkspace", title: "Action", width: 50,
                    template: function (cell) {
                        if (cell.IsAssociatedtoOtherWorkspace) {
                            return cell.Action === true ? '<a style="cursor:default;" class="AssignUnassignWorkitem"><i class="fa fa-times"><span class="AssignUnAssignButton">Unassign</span></i></a>' : '<a style= "cursor:default;" class="AssignUnassignWorkitem"> <i class="fa fa-check"><span class="AssignUnAssignButton">Assign</span></i></a >';
                        } else {
                            return cell.Action === true ? '<a style="cursor:default;" class="disabled greyoutf"><i class="fa fa-times"><span class="AssignUnAssignButton">Unassign</span></i></a>' : '<a style= "cursor:default;" class="disabled greyoutf"> <i class="fa fa-check"><span class="AssignUnAssignButton">Assign</span></i></a >';
                        }
                    }
                }
            ],
            messages: {
                noRows: "No records exist"
            },
            pageable: {
                pageSize: 15,
                pageSizes: true
            }
        });


        $(document).on('click', '#AddWSWIRel', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $.post('/WorkspaceEnduser/LoadWorkItemInstanceList', function (data, status) {
                $('#WIRelationPoup').modal('show');
                var List = data;
                if (data !== null) {
                    table3 = $('#WIInstanceLIst').DataTable({
                        "stripeClasses": [],
                        "destroy": true,
                        "processing": false,
                        "orderMulti": false,
                        "filter": false,
                        "pageLength": 7,
                        "order": [2, "asc"],
                        "paging": true,
                        "dom": '<"toolbar">frtip',
                        "scrollY": '50vh',
                        "language": {
                            "emptyTable": function (data) {
                                if ((recordsearch === "load" && data === "0") || (recordsearch === "load" && data === "")) {
                                    $('#btnWIRelationPoupOk').attr("disabled", true);
                                    $('#btnWIRelationPoupOk').css("cursor", 'not-allowed');
                                    return Web_Noworkitems;
                                }
                                else {
                                    return Web_Noworkitems;
                                }
                            }
                        },
                        "data": List,
                        "select": {
                            "style": 'os',
                            "selector": 'td:first-child'
                        },
                        "columns": [

                            { "data": "WorkitemInstanceId", "name": "WorkitemInstanceId", "className": "col-md-1 hidden", "orderable": false },
                            { "data": "Action", "name": "Action", "className": "col-md-1", "orderable": false },
                            { "data": "WorkitemInstanceName", "name": "WorkitemInstanceName", "className": "col-md-1", "orderable": true }
                        ],
                        'columnDefs': [{
                            'targets': 1,
                            'searchable': false,
                            'orderable': false,
                            'className': 'dt-body-center',
                            'render': function (data, type, full, meta) {
                                return '<input type="checkbox" class ="Chkbox" name="id[]" value="'
                                    + $('<div/>').text(data).html() + '">';
                            }
                        }],
                        drawCallback: function () {

                        },
                        'rowCallback': function (row, data, dataIndex) {
                        }
                    });

                    $("#txtwiItemInSearchField").on('keyup', function () {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var table = $('#WIInstanceLIst').DataTable();
                        var key = e.which;
                        if (key == 9 || key == 16) {
                            return false;
                        }
                        if ($('#txtwiItemInSearchField').val() != "" && key == 16) {
                            $("#txtwiItemInSearchField").focus();
                        }
                        SearchColumnName = $(this).parent().parent().data('headername');
                        var Workitemvalue = $(this).val();
                        SearchString = Workitemvalue;
                        url = WebURL + 'WorkspaceEnduser/GetWorkitemInstanceSearchRecords';
                        var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
                        var Searchdata;
                        $.post(url, params, function (data) {
                            Searchdata = data;
                            recordsearch = "Performed";
                            table.clear().rows.add(Searchdata).draw();
                        });
                    });

                    $('#WIInstanceLIst-select-all').on('click', function () {
                        rows_selected = [];
                        var rows = table3.rows({ 'search': 'applied' }).nodes();
                        $('input[type="checkbox"]', rows).prop('checked', this.checked);
                        if (this.checked == true) {
                            table3.rows().every(function () {
                                var data = this.data();
                                rows_selected.push(data.WorkitemInstanceId);
                                this.nodes().to$().addClass('selected');
                            });
                        }
                        else {
                            table3.rows().every(function () {
                                this.nodes().to$().removeClass('selected');
                            });
                        }
                    });

                    // Handle click on checkbox to set state of "Select all" control
                    $('#WIInstanceLIst tbody').on('change', 'input[type="checkbox"]', function () {
                        if (!this.checked) {
                            var el = $('#WIInstanceLIst-select-all').get(0);
                            if (el && el.checked && ('indeterminate' in el)) {
                                el.indeterminate = true;
                            }
                        }
                    });

                    $('#WIInstanceLIst tbody').on('click', 'input[type="checkbox"]', function (e) {
                        var $row = $(this).closest('tr');
                        var table2 = $("#WIInstanceLIst").DataTable();
                        // Get row data
                        var data = table3.row($row).data();
                        // Get Workitem Instnace ID
                        var WorkitemInstnaceID = data.WorkitemInstanceId;
                        var s = rows_selected;
                        if (this.checked) {
                            $row.addClass('selected');
                        } else {
                            $row.removeClass('selected');
                        }
                        // Update state of "Select all" control
                        //updateDataTableSelectAllCtrl(table3);
                        // Prevent click event from propagating to parent
                        e.stopPropagation();
                    });

                    // Handle click on table cells with checkboxes
                    $('#WIInstanceLIst').on('click', 'tbody td, thead th:first-child', function (e) {
                        $(this).parent().find('input[type="checkbox"]').trigger('click');
                    });

                    // Handle click on "Select all" control
                    $('thead input[name="select_all"]', table3.table().container()).on('click', function (e) {
                        if (this.checked) {
                            $('#WIInstanceLIst tbody input[type="checkbox"]:not(:checked)').trigger('click');
                        } else {
                            $('#WIInstanceLIst tbody input[type="checkbox"]:checked').trigger('click');
                        }
                        // Prevent click event from propagating to parent
                        e.stopPropagation();
                    });

                    // Handle table draw event
                    table3.on('draw', function () {
                        // Update state of "Select all" control
                        //updateDataTableSelectAllCtrl(table3);
                    });

                    // Handle form submission event 
                    $('#btnWIRelationPoupOk').on('click', function (e) {
                        var form = $("#WIListGrid");
                        $('#txtwiItemInSearchField').val("");
                        var table2 = $("#WIInstanceLIst").DataTable();
                        var rows = table2.rows('.selected').data();
                        for (i = 0; i < rows.length; i++) {
                            var WorkItems = rows[i].WorkitemInstanceId;
                            var index = $.inArray(WorkItems, rows);
                            if (this.checked && index === -1) {
                                rows_selected.push(WorkItems);
                                // Otherwise, if checkbox is not checked and Workitem Instnace ID is in list of selected row IDs
                            } else if (!this.checked && index !== -1) {
                                rows_selected.splice(index, 1);
                            }
                            else {
                                rows_selected.push(WorkItems);
                            }
                        }
                        // Iterate over all selected checkboxes
                        $.each(rows_selected, function (index, WorkitemInstnaceID) {
                            // Create a hidden element 
                            $(form).append(
                                $('<input>')
                                    .attr('type', 'hidden')
                                    .attr('name', 'id[]')
                                    .val(WorkitemInstnaceID)
                            );
                        });

                        // Sends the selected Workitem Ids to the Loading 
                        data = rows_selected.toString();
                        $.ajax('/WorkspaceEnduser/SelectedWIInstances', {
                            type: 'Post',  // http method
                            async: false,
                            data: { data: data },  // data to submit
                            success: function (data, status, xhr) {
                                $("#WIGridView").html('');
                                $("#WIGridView").html(data);
                            }
                        });

                        $('.WIRelationPoupCancel').on('click', function (e) {
                            rows_selected = [];
                            $('#WIInstanceLIst').DataTable().destroy();
                            $('#WIInstanceLIst').DataTable().draw();
                        });

                        // Remove added elements
                        $('input[name="id\[\]"]', form).remove();
                        rows_selected = [];
                        e.preventDefault();
                    });
                }
            });
        });

        $(document).on('click', '.AssignUnassignWorkitem', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            // var row_index = $(this).closest("td").closest("tr").index();
            var currenteventDetails = $("#gridbox").data("kendoTreeList").dataItem($(e.currentTarget).closest("tr"));

            var WorkitemInstanceId = currenteventDetails.WorkitemInstanceId;
            var Action = currenteventDetails.Action;
            //var id = currenteventDetails.id;
            var changeStatus;
            if (Action == true) {
                changeStatus = false;
            }
            else {
                changeStatus = true;
            }
            var params = { workItemInstanceID: WorkitemInstanceId, action: changeStatus };
            //var params = { WorkitemInstanceId: WorkitemInstanceId, ismapped: changeStatus, id: id };
            var PostUrl = WebURL + "WorkspaceEnduser/RelateWorkItems";
            $.ajax({
                type: 'Post',
                url: PostUrl,
                data: params,
                async: false,
                success: function (data) {
                    $("#WIGridView").html('');
                    $("#WIGridView").html(data);

                }
            });
        });

        $(document).on('click', '.WorkitemInstnaceNameLink', function (e) {
            var currenteventDetails = $("#gridbox").data("kendoTreeList").dataItem($(e.currentTarget).closest("tr"));
            var url = WebURL + "WorkitemEnduser/ViewWorkitem?workitemID=" + currenteventDetails.WorkitemInstanceId;
            window.location.href = url;
        });
    }
};

//Dashboard Workspace View 
var ViewWorkspace = {
    init: function (args) {
        this.DashboardWorkspace = args.WorkspaceViewModel;
        this.WebURL = args.URL;
        WebURL = this.WebURL;
        this.Mode = args.Mode;
        this.loadWorkspaceGrid();
        var workspacename = args.Workspacename;
        if (this.Mode == "WorkspaceInsSaveSuccess") {
            if (performance.navigation.type == 1) {
                //RedirectUrl = this.WebUrl + 'Workflow/Task/GetMasterTaskList';
                //window.location.replace(RedirectUrl);
            } else {
                var msg = Web_WorkspaceInstSaveSuccessPopup.replace("{0}", workspacename);
                $('#workspaceworkitemdashboardmsgs').removeClass('hide');
                $('#workspaceworkitemdashboardmsgs').html(msg);
                setTimeout(function () { $("#workspaceworkitemdashboardmsgs").html(''); }, Web_MsgTimeOutValue);
            }
        }
        if (this.DashboardWorkspace != null) {
            $('#WorkspaceViewgrid tfoot th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') == true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var SearchId = id + 'SearchField';
                    // var InputSearchbox = '<input type="text" class="form-control textbox" id="' + SearchId + '" placeholder="Search by ' + title + '" />';
                    var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            $('#WorkspaceViewgrid tfoot th').hide();
        }
        //this.searchGrid({ id: 'WorkspaceViewgrid', url: 'WorkflowEnduser/GetWorkspaceSearchRecords' })
        this.searchGrid({ id: 'WorkspaceViewgrid', url: WebURL + 'WorkflowEnduser/GetWorkspaceSearchRecords' });
    },

    loadWorkspaceGrid: function () {
        var data = this.DashboardWorkspace;
        var table = $('#WorkspaceViewgrid').DataTable({
            //"dom": '<"bottom"l>',
            "stripeClasses": [],
            "destroy": true,
            "processing": false, // for show progress bar
            //"serverSide": true, // for process server side
            "orderMulti": false,// for disable multiple column at once
            "filter": false,
            "searching": false,
            "order": [1, "asc"],
            // this is for disable filter (search box)
            "language": {
                "emptyTable": function (data) {
                    if ((recordsearch == "load" && data == "0") || (recordsearch == "load" && data == "")) {
                        // return "No Workspaces exists - To create one, click on Create a Workspace";
                        return Web_NoWorkspacesExists;
                    }
                    else if ((recordsearch == "Performed" && data == "0" && $('#txtWorkspaceSearchField').val() == "" && $('#txtWorkspaceTemplateSearchField').val() == "")) {
                        return Web_NoWorkspacesExists;
                    }
                    else {
                        // return "No Workspaces exists"
                        return Web_Noworkspaces;
                    }
                }
            },
            "data": data,
            "createdRow": function (row, data, dataIndex) {
                if (data.Status == false) {
                    $(row).addClass('greyoutf');
                    $(row).find('.aicon').css("opacity", "0.5");
                    $(row).find('.dicon').css("opacity", "0.5");
                }
            },
            "columns": [

                { "data": "WorkspaceInstanceID", "name": "ID", "className": "" },
                { "data": "WorkspaceInstanceName", "name": "Workspace", "className": "col-md-3 minwidth", "orderable": true },
                { "data": "WorkspaceTemplateName", "name": "Workspace template", "className": "col-md-3 ", "orderable": true },


                {
                    "data": "LastUpdatedDate", "name": "Last Updated On", "orderable": true, "type": "ce_datetime", "className": "col-md-2 text-center",
                    render: function (data, type, row) {
                        return moment.utc(data.replace(/-/g, ' ')).format('DD-MMM-YYYY HH:mm'); //(moment.utc(data, 'YYYY-MM-DDTHH:mm:ssZ').format("DD-MMM-YYYY HH:mm"));
                    }
                },
                { "data": "CreatedByUserName", "name": "Created by", "className": "col-md-2 text-center", "orderable": true },

                { "data": "Status", "name": "Status", "className": "col-md-1 text-center", "orderable": true },
                {
                    data: null,
                    defaultContent: '',
                    name: null,
                    className: "col-md-1 text-center",
                    orderable: false,
                    render: {
                        display: function (data, type, row) {
                            if (row.Status == true) {
                                return "<a class='ActivateDeativateWorkspace DeActivateWorkspace' style='cursor:pointer;' status='false'><label class='switch switchcustom'><input id = 'ActiveDeactiveWorkspace' type= 'checkbox' checked><span class='slider slidercustom round' title='Deactivate'></span></label></a>&nbsp;&nbsp;&nbsp;&nbsp;<a title='Edit' style='cursor:pointer;display: inline-flex;' class='editWorkspace'> <span class='edit-img'> </span></a>";

                            } else {
                                return "<a class='ActivateDeativateWorkspace ActivateWorkspace' style='cursor:pointer;' status='true'><label class='switch switchcustom'><input id = 'ActiveDeactiveWorkspace' type= 'checkbox' unchecked><span class='slider slidercustom round' title='Activate'></span></label></a>&nbsp;&nbsp;&nbsp;&nbsp;<a title='Edit' style='cursor:pointer;display: inline-flex;' class='editWorkspace'><span class='edit-img'> </span></a>";
                            }
                        }
                    },
                },
            ],
            columnDefs: [
                {
                    "targets": [1],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewWorkspace linkcolour">' + data + '</span>';
                    }
                },
                {
                    "targets": [2],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewWorkspaceTemplate linkcolour">' + data + '</span>';
                    }
                },
                {
                    "targets": [5],
                    render: function (data, type, row) {
                        return data === true ? '<span class="aicon">A</span>' : '<span class="dicon">D</span>';
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                //For applying Prieviliges
                WorkspaceInstancePermissionMap();
            }
        });
        $.fn.dataTableExt.oSort['date-pre'] = function (value) {
            return Date.parse(value.replace(/-/g, ' '));
            //moment(dt, "DD-MMM-YYYY HH:mm");
        };
        $.fn.dataTableExt.oSort['date-asc'] = function (a, b) {
            return a - b;
        };
        $.fn.dataTableExt.oSort['date-desc'] = function (a, b) {
            return b - a;
        };
        $(document).on('click', '.editWorkspace', function () {
            var table = $('#WorkspaceViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkspaceId = data_row_table.WorkspaceInstanceID;
            var url = "/WorkspaceEnduser/Edit?WSId=" + WorkspaceId;
            window.location.href = url;
            window.location.href = url;
        });
        $(document).on('click', '.ViewWorkspace', function () {
            var table = $('#WorkspaceViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var Workspace_Id = data_row_table.WorkspaceInstanceID;
            var url = "/WorkspaceEnduser/View?WSId=" + Workspace_Id;
            window.location.href = url;
        });
        $(document).on('click', '.ViewWorkspaceTemplate', function () {
            var table = $('#WorkspaceViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkspaceTemplateID = data_row_table.WorkspaceTemplateID;
            var url = "/WorkspaceTemplate/View?WorkspaceTemplateID=" + WorkspaceTemplateID;
            window.location.href = url;
        });
        this.ActivateDeactivateWorkspace();
    },

    searchGrid: function (args) {
        var table = $('#' + args.id).DataTable();
        table.columns().every(function () {
            var that = this;
            $('input', this.footer()).on('keyup change', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var table = $('#WorkspaceViewgrid').DataTable();
                var key = e.which;
                if (key == 9 || key == 16) {
                    return false;
                }

                if ($('#txtWorkspaceSearchField').val() != "" && key == 16) {
                    $("#txtWorkspaceTemplateSearchField").focus();
                }
                var txtWorkspace = $('#txtWorkspaceSearchField').val();
                var txtWorkspaceTemplate = $('#txtWorkspaceTemplateSearchField').val();

                url = args.url;
                SearchColumnName = $(this).parent().parent().data('headername');
                if (SearchColumnName == "Workspace") {
                    SearchString = [txtWorkspace, txtWorkspaceTemplate];
                }
                else if (SearchColumnName == "Workspace template") {
                    SearchString = [txtWorkspaceTemplate, txtWorkspace];
                }
                else {
                    SearchString = this.value;
                }
                url = args.url;

                var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
                var Searchdata;
                $.post(url, params, function (data) {
                    Searchdata = data;
                    recordsearch = "Performed";
                    table.clear().rows.add(Searchdata).draw();
                });
            });
        });

    },

    ActivateDeactivateWorkspace: function () {
        $(document).on('change', '#ActiveDeactiveWorkspace', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkspaceViewgrid').DataTable();
            var data = table.row($(this).closest('tr')).data();
            var WorkspaceID = data.WorkspaceInstanceID;
            var status = data.Status;
            var WorkspaceName = data.WorkspaceInstanceName;
            var mStatus;
            var message;
            var title;
            if (status == true) {
                mStatus = false;
                $('#WorkspaceID').val(WorkspaceID);
                $('#WorkspaceIsactive').val(mStatus);
                $('#Workspace').val(WorkspaceName);
            }
            else {
                mStatus = true;
                $('#WorkspaceID').val(WorkspaceID);
                $('#WorkspaceIsactive').val(mStatus);
                $('#Workspace').val(WorkspaceName);
            }
            var WorkspaceId = $("#WorkspaceID").val();
            var Status = $('#WorkspaceIsactive').val();

            var params = { workspaceInstanceID: WorkspaceId, status: Status };
            var PostUrl = WebURL + "WorkflowEnduser/ActivateDeactivateWorkspace";
            $.ajax({
                type: 'POST',
                url: PostUrl,
                data: params,
                async: false,
                success: function (data) {
                    $('#ActivateDeactiveModelAlert').modal('hide');
                    var table = $('#WorkspaceViewgrid').DataTable();
                    if (SearchColumnName == '' && SearchString == '') {
                        SearchColumnName: "All Workspace";
                        sSearchString: "";
                    }
                    var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
                    var Searchdata;
                    $.post(WebURL + "WorkflowEnduser/GetWorkspaceSearchRecords", params, function (data) {
                        Searchdata = data;
                        table.clear().rows.add(Searchdata).draw();
                    });
                    if (data === "Insufficient privilleges") {
                        var msg;
                        if (Status === "false") {
                            msg = Web_InsufficientPrivillegesforDeactivateWorkspaceIns;
                        }
                        else if (Status === "true") {
                            msg = Web_InsufficientPrivillegesforActivateWorkspaceIns;
                        }
                        $('#workspaceworkitemdashboardmsgs').removeClass('hide');
                        $('#workspaceworkitemdashboardmsgs').removeClass('txtcolourforestgreen');
                        $('#workspaceworkitemdashboardmsgs').addClass('text-danger');
                        $('#workspaceworkitemdashboardmsgs').html(msg);
                        setTimeout(function () { $("#workspaceworkitemdashboardmsgs").html(''); }, Web_MsgTimeOutValue);
                    }
                }
            });
        });

        //$('#btnWorkspacePopupNo').on('click', function () {
        //    $('#ActivateDeactiveModelAlert').modal('hide');
        //    var table = $('#WorkspaceViewgrid').DataTable();
        //    if (SearchColumnName == '' && SearchString == '') {
        //        SearchColumnName: "All Workspace";
        //        sSearchString: "";
        //    }
        //    var params = { SearchColumnName: SearchColumnName, sSearchString: SearchString };
        //    var Searchdata;
        //    $.post("WorkflowEnduser/GetWorkspaceSearchRecords", params, function (data) {
        //        Searchdata = data;
        //        table.clear().rows.add(Searchdata).draw();
        //    });
        //});

        //$("#btnWorkspacePopupYes").on('click', function (e) {
        //    var WorkspaceId = $("#WorkspaceID").val();
        //    var Status = $('#WorkspaceIsactive').val();
        //    var Notes = $('#WorkspacePopadnotes').val();
        //    var params = { WorkspaceInstance_Id: WorkspaceId, Status: Status, Notes: Notes };
        //    $.ajax({
        //        type: 'POST',
        //        url: "WorkflowEnduser/ActivateDeactivateWorkspace",
        //        data: params,
        //        async: false,
        //        success: function (data) {
        //            $('#ActivateDeactiveModelAlert').modal('hide');
        //            var table = $('#WorkspaceViewgrid').DataTable();
        //            if (SearchColumnName == '' && SearchString == '') {
        //                SearchColumnName: "All Workspace";
        //                sSearchString: ""
        //            }
        //            var params = { SearchColumnName: SearchColumnName, sSearchString: SearchString };
        //            var Searchdata;
        //            $.post("WorkflowEnduser/GetWorkspaceSearchRecords", params, function (data) {
        //                Searchdata = data;
        //                table.clear().rows.add(Searchdata).draw();
        //            });
        //        }
        //    });
        //});
    }
};
//Use this if needed only workspace code
$(document).ready(function () {
    $('#WSinstanceName').focusout(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        var WorkspaceId;
        if ($(this).hasClass('required')) {
            if ($('#' + CurrentId).val() == "") {
                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            }
            else {
                if ($("#WSinstanceNameId").val() == null || $("#WSinstanceNameId").val() == "") {
                    WorkspaceId = 0;
                }
                else {
                    WorkspaceId = $("#WSinstanceNameId").val();
                }
                var Isavilable = CheckWorkspaceInstNameAvailability(value, WorkspaceId);
                if (Isavilable) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkspaceInstanceAlreadyExistsInlineMessage.replace("{0}", value) + '</span>');
                    //$('#' + CurrentId).next().after('<span class="text-danger ' + varErrorClassName + '">' + value + ' Workspace already exists. </span>');
                    return false;
                }
                else {
                    if (value.length > 100) {
                        $('.errmsg' + CurrentId).remove();
                        varErrorClassName = 'errmsg' + CurrentId;
                        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                    }
                    else {
                        $('.errmsg' + CurrentId).remove();
                    }
                }
            }
        }
    });
    $('#WSinstanceDesc').blur(function () {
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (value != "") {
            if (value.length > allowedmaxlength) {

                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
            }
            else {

                $('.errmsg' + CurrentId).remove();
            }
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });
    $("#DrpWorkspaceTemplate").on('change', function () {
        var selectWorkspaceTemp = $("#DrpWorkspaceTemplate").val();
        var labelName = $('#DrpWorkspaceTemplate').data('validatelabel');
        var CurrentId = $('#DrpWorkspaceTemplate').attr('id');
        if (selectWorkspaceTemp == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            validateallfields = false;
            return false;
        } else {
            $('.errmsg' + CurrentId).remove();
        }
    });
    $('#DrpWorkspaceTemplate').focusout(function () {
        var WorkspaceTemplateVal = $("#DrpWorkspaceTemplate").val();
        var labelName = $('#DrpWorkspaceTemplate').data('validatelabel');
        var CurrentId = $('#DrpWorkspaceTemplate').attr('id');
        if (WorkspaceTemplateVal == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });
    //$('.MaxLengthWSInstValidation').keypress(function (e) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var keyCode = e.which;
    //    var value = $("#" + CurrentId).val();
    //    if (value.length > allowedmaxlength - 1 && keyCode != 8 && keyCode != 0) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else {

    //        $('.errmsg' + CurrentId).remove();

    //    }
    //});
    //$(".MaxLengthWSInstValidation").on("keyup", function (event) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var value = $("#" + CurrentId).val();
    //    var code = event.keyCode || event.which;
    //    if (code == 8 && value.length == 0) {
    //        $('.errmsg' + CurrentId).remove();
    //    }
    //    if (code == 8 && value.length < allowedmaxlength) {
    //        $('.errmsg' + CurrentId).remove();
    //    }
    //});
    $('#WSInstNotes').blur(function () {
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (value != "") {
            if (value.length > 300) {

                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
            }
            else {
                $('.notesTagUsers-ws').removeClass('hide');
                $('.errmsg' + CurrentId).remove();
            }
        }
        else {
            $('.notesTagUsers-ws').addClass('hide');
            $('.errmsg' + CurrentId).remove();
        }
    });
    //$('.NameValidatorWSInst').keypress(function (e) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var keyCode = e.which;
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var value = $("#" + CurrentId).val().trim();
    //    if ((keyCode < 48 || keyCode > 57)
    //        && (keyCode < 65 || keyCode > 90)
    //        && (keyCode < 97 || keyCode > 122)
    //        && (keyCode != 0)
    //        && (keyCode != 8)
    //        && (keyCode != 32)
    //        && (keyCode != 45)) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else if (value.length > allowedmaxlength - 1 && keyCode != 8 && keyCode != 0) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else {

    //        $('.errmsg' + CurrentId).remove();
    //    }
    //});

    $('.ViewWsInsNoteslink').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var objectId = $("#WSinstanceNameId").val().trim();
        var catid = 10;
        var url = WebURL + "Notes/GetNotesByID?objectId=" + objectId + "&categoryId=" + catid;
        window.open(url);
    });
    $('.btnCancelWsInstance').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        //window.history.back();
        RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=WorkspaceInfo';
        window.location.replace(RedirectUrl);
    });
    $('.btnBacklWIInstance').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=' + localStorage.getItem("activeTabid");
        window.location.replace(RedirectUrl);
    });
    $(document).on('click', '.editWorkspaceTempl', function () {
        var url = "/WorkspaceEnduser/Edit?WSId=" + $('#WSinstanceNameId').val();
        $("#btnCancelWSInstance").css("display", "none");
        $("#btnbackWSInstance").removeClass("hide");
        window.location.href = url;
    });
    $(document).on('click', '#NewWSWILink', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var workspaceid = $("#WSinstanceNameId").val();
        var url = "/WorkitemEnduser/CreateWorkitem?workspaceid=" + workspaceid;
        window.open(url);
    });

    //$('#WSinstanceName, #WSinstanceDesc').on('paste', function (event) {
    //    if (event.originalEvent.clipboardData.getData('Text').match(/[^a-zA-Z0-9- ]/)) {
    //        event.preventDefault();
    //        var labelName = $(this).data('validatelabel');
    //        var CurrentId = $(this).attr('id');
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //        event.preventDefault();
    //    }
    //});

});
$(document).on('change', '.ActivateDeactivatetooltipWS', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var result = $('#de-activated').is(':visible');
    if (result) {
        $('#activated').removeClass('hide');
        $('#de-activated').addClass('hide');
        $('.statusalign').attr("title", "Click to de-activate the workspace");
    }
    else {
        $('#activated').addClass('hide');
        $('#de-activated').removeClass('hide');
        $('.statusalign').attr("title", "Click to activate the workspace");
    }
    if (!ActivateWorkspace) {
        $('#WSInstanceStatus').prop('disabled', true);
        $('.statusalign').attr("title", "Insufficient privileges");
    }
    if (!DeactivateWorkspace) {
        $('#WSInstanceStatus').prop('disabled', true);
        $('.statusalign').attr("title", "Insufficient privileges");
    }
});

function WSInstanceCreateEditValidatons() {
    var validateallfields = true;
    var WorkspaceInstName = $("#WSinstanceName").val().trim();
    var WorkspaceTemplate = $("#DrpWorkspaceTemplate").val();
    var WorkspaceInstDescription = $("#WSinstanceDesc").val().trim();
    var WorkspaceInstNotes = $("#WSInstNotes").val().trim();
    var allowedmaxlength_WorkspaceInstName = $('#WSinstanceName').data('maxlength');
    var allowedmaxlength_WSInstDescription = $('#WSinstanceDesc').data('maxlength');
    var allowedmaxlength_WSInstNotes = $('#WSInstNotes').data('maxlength');
    var WorkspaceId;
    var value = WorkspaceInstName;
    if (WorkspaceInstName == "" || WorkspaceTemplate == "") {
        if (WorkspaceInstName == "") {
            var labelName = $('#WSinstanceName').data('validatelabel');
            var CurrentId = $('#WSinstanceName').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
            validateallfields = false;
        }
        if (WorkspaceTemplate == "") {
            var labelName = $('#DrpWorkspaceTemplate').data('validatelabel');
            var CurrentId = $('#DrpWorkspaceTemplate').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
            validateallfields = false;
        }
    }
    else {
        if ($("#WSinstanceNameId").val() == null || $("#WSinstanceNameId").val() == "") {
            WorkspaceId = 0;
        }
        else {
            WorkspaceId = $("#WSinstanceNameId").val();
        }
        var Isavilable = CheckWorkspaceInstNameAvailability(value, WorkspaceId);
        if (Isavilable) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkspaceInstanceAlreadyExistsInlineMessage.replace("{0}", value) + '</span>');
            //ShowDuplicateWSNamePopMessage('Alert', WorkspaceInstName);
            return false;
        }
        if (WorkspaceInstName.length > allowedmaxlength_WorkspaceInstName) {
            var labelName = $('#WSinstanceName').data('validatelabel');
            var CurrentId = $('#WSinstanceName').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength_WorkspaceInstName) + ' ');
            validateallfields = false;
        }
        if (WorkspaceInstDescription.length > allowedmaxlength_WSInstDescription) {
            var labelName = $('#WSinstanceDesc').data('validatelabel');
            var CurrentId = $('#WSinstanceDesc').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength_WSInstDescription) + ' ');
            validateallfields = false;
        }
        if (WorkspaceInstNotes.length > allowedmaxlength_WSInstNotes) {
            var labelName = $('#WSInstNotes').data('validatelabel');
            var CurrentId = $('#WSInstNotes').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength_WSInstNotes) + ' ');
            validateallfields = false;
        }
    }
    return validateallfields;
}
function ShowWSInstAlertMessage(title, messgae) {
    $('#WSInstAlertModal').modal('show');
    var modal = $('#WSInstAlertModal');
    modal.find('.modal-title').text(title)
    modal.find('.modal-body').text(messgae);
}
function ShowCreateWorkspaceInstSuccess(message) {
    $('#CreateWSInstModal').modal('show');
    var modal = $('#CreateWSInstModal');
    modal.find('.modal-title').text('Success!');
    //modal.find('.modal-body').html("<p>Workspace " + message + " is being created successfully.</p>");
    modal.find('.modal-body').html('<span>' + Web_WorkspaceInstSaveSuccessPopup.replace("{0}", message) + '</span> ');
}
function ShowDuplicateWSNamePopMessage(title, message) {
    $('#WSNameDuplicateAlertModal').modal('show');
    var modal = $('#WSNameDuplicateAlertModal');
    modal.find('.modal-title').text(title);
    modal.find('.modal-body p').html(Web_WorkSpaceAlreadyExistsSameNameCantBeCreated.replace("{0}", message));
}
function CheckWorkspaceInstNameAvailability(value, WorkspaceId) {
    var resopnseobj = false;
    var params = { WorkspaceName: value, WorkspaceId: WorkspaceId };
    $.ajax({
        type: 'POST',
        url: "WSInstNameDuplicatecheck",
        data: params,
        async: false,
        success: function (response) {
            resopnseobj = response;
        }
    });
    return resopnseobj;
}

function ShowWorkspaceUpdateSuccess(message) {
    $('#UpdateWSModal').modal('show');
    var modal = $('#UpdateWSModal');
    modal.find('.modal-title').text('Success!');
    modal.find('.modal-body').html("<p>Work space <b>" + message + "</b>  updated successfully.</p>");
    // modal.find('.modal-body').html('<span>' + Web_WorkSpaceInstanceUpdate.replace("{0}", message) + '</span> ');
}



/***************************************************End Of Workspace Section******************************/









/*************************************************Workitem Section***************************************/

var workitemEndUser;
var wiEndUser;
var WorkItem;
var WebUrl;
var selresponsbility = 0;
var selresourceId = 0;
var rId, selwiIndex;
var fileExtensionTypes;
var fileExtensionTypesList = [];
var maxFileCount;
var azureUri;
var LoadAttachmentGrid;
var uploadProgress;
var workItemMode;
var tempWIAttachmentDir;
var pendReqContainer;
var ViewWorkItemResourceAllocation;
var WorkItemInstance = {
    init: function (args) {
        this.WorkItemEndUser = args.WorkItemEndUser;
        this.WebURL = args.Url;
        WebURL = this.WebURL;
        WebUrl = args.Url;
        workitemEndUser = args.WorkItemEndUser;
        fileExtensionTypes = args.WorkItemEndUser.WorkItemInstance.FileExtensionTypesList;
        this.Mode = args.Mode;
        maxFileCount = args.MaxFileCount;
        if (azureUri == undefined || azureUri == null) {
            azureUri = args.AZStoreUri;
        }
        if (tempWIAttachmentDir == undefined || tempWIAttachmentDir == null) {
            tempWIAttachmentDir = args.TempWIAttachmentDir;
        }
        if (pendReqContainer == undefined || pendReqContainer == null) {
            pendReqContainer = args.PendingRequestsContainer;
        }
        if (workItemMode == undefined || workItemMode == null || workItemMode == "") {
            workItemMode = args.Mode;
        }
        LoadAttachmentGrid = args.LoadAttachmentGrid;
        UserPrivilege = args.UserPrivilege;
        LoadSPINPrivileges(UserPrivilege);
        ValidateSPINPrivileges();
        //if (this.Mode === "CreateWorkItem") {
        //    $('#ddlStatus').prop('disabled', true);
        //}
        if (this.Mode === "EditWorkItem") {
            $('#ddlrelatedwspaceInstance').attr('disabled', 'disabled');
            $('#ddlwITemplate').attr('disabled', 'disabled');
            if (workitemEndUser !== null && workitemEndUser.WorkItemInstance !== null && workitemEndUser.WorkItemInstance.workspaceworkItem !== null) {
                if (workitemEndUser.WorkItemInstance.WorkItemStatusID === 6 && workitemEndUser.WorkItemInstance.workspaceworkItem.WorkspaceInstanceStatus === false) {
                    $('#ddlStatus').prop('disabled', true);
                }
            }
        }
        else if (this.Mode == "Relatedworkitems") {
            var tab = 'step3';
            $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            $("#displaytext").html("Step 3 - Related work items");
            $('#ddlrelatedwspaceInstance').attr('disabled', 'disabled');
            $('#ddlwITemplate').attr('disabled', 'disabled');
        }

        if (this.Mode === "CreateWorkSpaceWorkItem") {
            $('#ddlrelatedwspaceInstance').attr('disabled', 'disabled');
            $('#ddlrelatedwspaceInstance').css("cursor", 'not-allowed');
        }
        var isFromDashboard = $('#isFromDashboard').val();
        if (this.Mode === "ViewWorkItem") {
            if (ViewWorkItemResourceAllocation === true) {
                $('#ResourceallocationList').removeClass('hide');
                $('#ResourceallocationList, #ResourceInfo').addClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').removeClass('active');
            }
            else if (isFromDashboard === "True") {
                $('#ResourceallocationList').addClass('hide');
                $('#ResourceallocationList, #ResourceInfo').removeClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').addClass('active');
            }
        }
        if (this.WorkItemEndUser != null) {
            $('#wiResourceslist th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') == true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var primary = $(this).attr('primary');
                    var SearchId = id + 'SearchField';
                    // var InputSearchbox = '<input type="text" class="form-control textbox" id="' + SearchId + '" placeholder="Search by ' + title + '" />';
                    if (val == true && primary == 'primaryData') {
                        var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i> <input type="checkbox" id="chkPrimaryRes"/> <label>Primary contact<label/>  </div>';
                    }
                    else {
                        var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i> </div>';
                    }
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            //$('#wiResourceslist th').hide();
        }
        if (this.WorkItemEndUser != null) {
            $('#WSRelatedWIList th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') == true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var SearchId = id + 'SearchField';
                    // var InputSearchbox = '<input type="text" class="form-control textbox" id="' + SearchId + '" placeholder="Search by ' + title + '" />';
                    var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            //$('#WSRelatedWIList th').hide();
        }

        this.UpdateWI();
        this.CreateWIInstance(wiEndUser);
        this.LoadResourcesGrid(wiEndUser);
        if (LoadAttachmentGrid === "true") {
            this.LoadAttachmentsGrid(wiEndUser);
        }
    },
    CreateWIInstance: function (args) {
        $("#btnwiInsatnceSave").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var grid = $("#WorkItem_BillingRates").closest(".k-grid");
            editRow = grid.find(".k-grid-edit-row");
            if (editRow.length > 0) {
                message = Web_SaveCancelResponsibility;
                $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                $('.WIBillingRatesGridErrorMsg').html(message);
                window.scrollTo(0, 0);
                setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
            } else {
                workitemEndUser.WorkItemInstance.WorkItemInstanceID = $("#txtWIInstanceID").val().trim();
                workitemEndUser.WorkItemInstance.WorkItemInstanceName = $("#txtWIInstanceName").val().trim();
                workitemEndUser.WorkItemInstance.Description = $("#txtWIDescription").val().trim();
                workitemEndUser.WorkItemInstance.WorkItemStatusID = $("#ddlStatus option:selected").val();
                //workitemEndUser.WorkItemInstance.WorkspaceInstanceID = $("#ddlrelatedwspaceInstance option:selected").val();                        
                workitemEndUser.WorkItemInstance.workspaceworkItem.WorkspaceInstanceId = $("#ddlrelatedwspaceInstance option:selected").val();
                workitemEndUser.WorkItemInstance.WorkItemTemplateID = $("#ddlwITemplate option:selected").val();
                // External resource management changes
                workitemEndUser.WorkItemInstance.FinanceDivisionID = $("#ddlwIfindivsion option:selected").val();
                workitemEndUser.WorkItemInstance.SAGEOwnerID = $("#ddlwISAGEOwner option:selected").val();
                workitemEndUser.WorkItemInstance.WIInstanceNotes = {};
                workitemEndUser.WorkItemInstance.WIInstanceNotes.NotesDescription = $("#addNotes").val().trim();
                workitemEndUser.bulkcopy = $('#chkbulkcopystatus').is(":checked");
                if (workitemEndUser.bulkcopy === true) {
                    workitemEndUser.bulkcopycount = $("#bulkcopycount option:selected").val();
                }
                //Billing Rates functionality
                var billingRatesType = $("input:radio[name='LocalOrInheritedWorkItem']:checked").val();
                if (workitemEndUser.WorkItemInstance.WorkItemBillingRates !== null) {
                    if (billingRatesType === "Local") {
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsLocalWorkItem = true;
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsInheritedWorkItem = false;
                    }
                    else if (billingRatesType === "Inherited") {
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsLocalWorkItem = false;
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsInheritedWorkItem = true;
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID = $("#ddlInheritedWorkItem").val();
                    }
                    workitemEndUser.WorkItemInstance.WorkItemBillingRates.OverrideTypeID = $("#ddlOverrideType").val();
                }
                //Tagging users code
                var selectedTaggedUsers = $("#drpTaggedUsers").val();
                if (selectedTaggedUsers != null) {
                    var selectedIds = selectedTaggedUsers.toString().split(',');
                }
                var taggedUsers = [];
                taggedUsers = $("#drpTaggedUsers").data("kendoMultiSelect").options.dataSource;
                for (var id in selectedIds) {
                    for (var item in taggedUsers) {
                        if (selectedIds[id] == taggedUsers[item].UserID) {
                            taggedUsers[item].IsUserTaggedSelected = true;
                            break;
                        }
                    }
                }
                workitemEndUser.WorkItemInstance.WIInstanceNotes.TaggedUsersList = taggedUsers;
                var data = JSON.stringify(workitemEndUser);
                var res = true;
                //var IsBulk = $('#chkbulkcopystatus').is(":checked");
                progress("1");
                if (res == true) {
                    $.ajax('SaveWorkItemInstance', {
                        type: 'POST',  // http method
                        data: data,
                        async: true,
                        dataType: 'json',
                        contentType: 'application/json',
                        success: function (data, status, xhr) {
                            progress("2");
                            var ResStatus = data.statusResponse;
                            var WorkitemID = data.workItemInstanceID;
                            if (ResStatus == "true") {
                                RedirectUrl = WebURL + "WorkflowInstance/CreateWorkflowInstance?workItemID=" + WorkitemID + "&status=CreateWII";
                                window.location.replace(RedirectUrl);
                            }
                            else if (ResStatus == "false") {
                                var msg = Web_WorkitemCanNotbeenCreated.replace("{0}", $("#txtWIInstanceName").val().trim());
                                $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                                $('#WIEditSuccessMsg').removeClass('hide');
                                $('#WIEditSuccessMsg').html(msg);
                                $('#WIEditSuccessMsg').addClass("text-danger");
                                window.scrollTo(0, 0);
                                setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                            }
                            else if (ResStatus == "CopyFilesBetweenContainersFail") {
                                var msg = WorkItem_FileUploadFailedInCreate;//"Failed to upload the files to blob"
                                $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                                $('#WIEditSuccessMsg').removeClass('hide');
                                $('#WIEditSuccessMsg').html(msg);
                                $('#WIEditSuccessMsg').addClass("text-danger");
                                window.scrollTo(0, 0);
                                setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                            }
                            else if (ResStatus === "MetadataMandatoryCheckFail") {
                                $.ajax('ViewMetadataMandatoryDetails', {
                                    type: 'POST',  // http method
                                    success: function (data, status, xhr) {
                                        $('#MetadataMandatoryDetailsPopup').modal('show');
                                        $('#MetadataMandatoryDetailsbody').html(data);
                                    }
                                });
                            }
                            else {
                                var msg1 = Web_WorkitemBulkCopyNameLengthExceeds.replace("{0}", data);
                                $('#WIBulkCopyNameExceeds').removeClass('txtcolourforestgreen');
                                $('#WIBulkCopyNameExceeds').removeClass('hide');
                                $('#WIBulkCopyNameExceeds').html(msg1);
                                $('#WIBulkCopyNameExceeds').addClass("text-danger");
                                window.scrollTo(0, 0);
                                setTimeout(function () { $("#WIBulkCopyNameExceeds").html(''); }, Web_MsgTimeOutValue);
                            }
                        },
                        error: function () {
                            progress("2");
                            var msg = Web_WorkitemCanNotbeenCreated.replace("{0}", $("#txtWIInstanceName").val().trim());
                            $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                            $('#WIEditSuccessMsg').removeClass('hide');
                            $('#WIEditSuccessMsg').html(msg);
                            $('#WIEditSuccessMsg').addClass("text-danger");
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                    });
                }
                else {
                    if (res == "ReqField_Invalid") {
                        ShowWIInstAlertMessage('Alert!', Web_EnterAllRequiredFields);
                        return false;
                    }
                    else {
                        return false;
                    }
                    progress("2");
                }
            }
        });
    },
    UpdateWI: function () {
        $("#btnwiEditSave").click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();

            var res = WIInstanceValidations();
            //if (res === false || res === "ReqField_Invalid") {
            //    if (res === "ReqField_Invalid") {
            //        AlertPopUp('Alert!', Web_EnterAllRequiredFields);
            //    }
            //    return false
            //}
            var grid = $("#WorkItem_BillingRates").closest(".k-grid");
            editRow = grid.find(".k-grid-edit-row");
            if (editRow.length > 0) {
                message = Web_SaveCancelResponsibility;
                $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                $('.WIBillingRatesGridErrorMsg').html(message);
                window.scrollTo(0, 0);
                setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
            } else {
                var WorkitemInstance = $("#txtWIInstanceName").val();
                workitemEndUser.WorkItemInstance.WorkItemInstanceID = $("#txtWIInstanceID").val().trim();
                workitemEndUser.WorkItemInstance.WorkItemInstanceName = $("#txtWIInstanceName").val().trim();
                workitemEndUser.WorkItemInstance.Description = $("#txtWIDescription").val().trim();
                workitemEndUser.WorkItemInstance.WorkItemStatusID = $("#ddlStatus option:selected").val();
                workitemEndUser.WorkItemInstance.WorkspaceInstanceID = $("#ddlrelatedwspaceInstance option:selected").val();
                workitemEndUser.WorkItemInstance.WorkItemTemplateID = $("#ddlwITemplate option:selected").val();
                // External resource management changes
                workitemEndUser.WorkItemInstance.FinanceDivisionID = $("#ddlwIfindivsion option:selected").val();
                workitemEndUser.WorkItemInstance.SAGEOwnerID = $("#ddlwISAGEOwner option:selected").val();
                workitemEndUser.WorkItemInstance.WIInstanceNotes = {};
                workitemEndUser.WorkItemInstance.WIInstanceNotes.NotesDescription = $("#addNotes").val().trim();
                workitemEndUser.bulkcopy = $(".chkbulkcopy option:selected").val();
                workitemEndUser.bulkcopycount = $("#bulkcopycount option:selected").val();
                workitemEndUser.WorkItemInstance.Version_Stamp = $("#WorkItemVersionStamp").val();
                if (workitemEndUser.WorkItemInstance.WorkItemResourcesList !== null) {
                    for (i = 0; i < workitemEndUser.WorkItemInstance.WorkItemResourcesList.length; i++) {
                        if (workitemEndUser.WorkItemInstance.WorkItemResourcesList[i].ResponsibilityID === 0) {
                            responrowID = workitemEndUser.WorkItemInstance.WorkItemResourcesList[i].Sequence - 1;
                            var selresponsbility = $('#ddlTaskRelation' + responrowID + ' option:selected').val();
                            workitemEndUser.WorkItemInstance.WorkItemResourcesList[i].ResponsibilityID = selresponsbility;
                        }
                    }
                }
                //Billing Rates functionality
                var billingRatesType = $("input:radio[name='LocalOrInheritedWorkItem']:checked").val();
                if (workitemEndUser.WorkItemInstance.WorkItemBillingRates !== null) {
                    if (billingRatesType === "Local") {
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsLocalWorkItem = true;
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsInheritedWorkItem = false;
                    }
                    else if (billingRatesType === "Inherited") {
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsLocalWorkItem = false;
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.IsInheritedWorkItem = true;
                        workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID = $("#ddlInheritedWorkItem").val();
                    }
                    workitemEndUser.WorkItemInstance.WorkItemBillingRates.OverrideTypeID = $("#ddlOverrideType").val();
                }
                //Tagging users code
                var selectedTaggedUsers = $("#drpTaggedUsers").val();
                if (selectedTaggedUsers !== null && selectedTaggedUsers !== undefined) {
                    var selectedIds = selectedTaggedUsers.toString().split(',');
                }
                var taggedUsers = [];
                if (selectedTaggedUsers !== undefined) {
                    taggedUsers = $("#drpTaggedUsers").data("kendoMultiSelect").options.dataSource;
                }
                for (var id in selectedIds) {
                    for (var item in taggedUsers) {
                        if (selectedIds[id] === taggedUsers[item].UserID) {
                            taggedUsers[item].IsUserTaggedSelected = true;
                            break;
                        }
                    }
                }
                workitemEndUser.WorkItemInstance.WIInstanceNotes.TaggedUsersList = taggedUsers;
                var data = JSON.stringify(workitemEndUser);
                //   var data = $(".wiInstance").serialize();
                this.workitemEndUser = data;
                progress("1");
                $.ajax('UpdateWorkItem', {
                    type: 'POST',  // http method
                    data: data,
                    async: true,
                    dataType: 'json',
                    contentType: 'application/json',
                    success: function (data, status, xhr) {
                        progress("2");
                        if (data == true) {
                            var message = Web_WorkItemInstanceUpdate.replace("{0}", WorkitemInstance);
                            $('#WIEditSuccessMsg').removeClass('hide');
                            $('#WIEditSuccessMsg').html(message);
                            $('#WIEditSuccessMsg').addClass('txtcolourforestgreen');
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                            setTimeout(function () {
                                location.reload();
                            }, 3000);
                        }
                        else if (data === "MetadataMandatoryCheckFail") {
                            var workItemStatusID = $("#ddlStatus").val();
                            $.ajax('ViewMetadataMandatoryDetails', {
                                type: 'POST',  // http method
                                success: function (data, status, xhr) {
                                    $("#ddlStatus").val(workItemStatusID);
                                    $('#MetadataMandatoryDetailsPopup').modal('show');
                                    $('#MetadataMandatoryDetailsbody').html(data);
                                }
                            });
                        }
                        else if (data === "TaskProblemCheckFail") {
                            var msg1 = Web_WorkItemCannotSetToCompleteWithTasksHavingProblemFlag;
                            $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                            $('#WIEditSuccessMsg').removeClass('hide');
                            $('#WIEditSuccessMsg').html(msg1);
                            $('#WIEditSuccessMsg').addClass("text-danger");
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                        else {
                            var msg = data.indexOf("Concurrency") >= 0 ? Web_ProblemInWorkItemUpdate : Web_WorkItemCannotUpdated.replace("{0}", WorkitemInstance);
                            $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                            $('#WIEditSuccessMsg').removeClass('hide');
                            $('#WIEditSuccessMsg').html(msg);
                            $('#WIEditSuccessMsg').addClass("text-danger");
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                    },
                    error: function () {
                        progress("2");
                        var msg = data.indexOf("Concurrency") >= 0 ? Web_ProblemInWorkItemUpdate : Web_WorkItemCannotUpdated.replace("{0}", WorkitemInstance);
                        $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                        $('#WIEditSuccessMsg').removeClass('hide');
                        $('#WIEditSuccessMsg').html(msg);
                        $('#WIEditSuccessMsg').addClass("text-danger");
                        window.scrollTo(0, 0);
                        setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                    }
                });
            }
        });
    },
    LoadResourcesGrid: function (args) {
        var data;
        if (workitemEndUser !== null) {
            if (workitemEndUser.WorkItemhistResources !== null) {
                data = workitemEndUser.WorkItemhistResources;
            }
        }
        table1 = $('#Resourcesgrid').dataTable({
            "stripeClasses": [],
            "destroy": true,
            "processing": false, // for show progress bar
            //"serverSide": true, // for process server side
            "orderMulti": false,// for disable multiple column at once
            "filter": false,
            "order": [1, "asc"],
            "paging": false,
            "scrollY": '50vh',
            "language": {
                "emptyTable": function (data) {
                    if ((recordsearch == "load" && data == "0") || (recordsearch == "load" && data == "")) {
                        return Web_NohistoryRecordsfound;
                    }
                }
            },

            "data": data,

            "columns": [
                { "data": "ResourceName", "name": "ResourceName", "visible": false },
                { "data": "ResponsibilityName", "name": "ResponsibilityName" },
                {
                    "data": "StartDate", "name": "StartDate",
                    render: function (data, type, row) {
                        return moment.utc(data).format('DD-MMM-YYYY HH:mm');
                    }
                },
                {
                    "data": "EndDate", "name": "EndDate",
                    render: function (data, type, row) {
                        return moment.utc(data).format('DD-MMM-YYYY HH:mm');
                    }
                }
            ],

            drawCallback: function () {

                var api = this.api();
                var rows = api.rows({ page: 'current' }).nodes();
                var last = null;

                api.column(0, { page: 'current' }).data().each(function (group, i) {
                    if (last !== group) {

                        $(rows).eq(i).before(
                            '<tr class="group"><td colspan="3">' + group + '</td></tr>'
                        );
                        last = group;
                    }
                });
            }
        });
    },
    LoadAttachmentsGrid: function (args) {
        var FilesList;
        $('#fileAttachment_div').addClass('hide');
        $('#WorkItemAttachmentGrid tfoot th').each(function () {
            var val = $(this).data('searchable');
            if ($(this).data('searchable') === true) {
                var title = $(this).text();
                var id = $(this).attr('id');
                var SearchId = id + 'SearchField';
                var InputSearchbox;
                InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                $(this).html(InputSearchbox);
            }
        });
        FilesList = workitemEndUser.WorkItemInstance.WorkItemFileManagementList;
        workitemEndUser.WorkItemInstance.WorkItemFileManagementList = workitemEndUser.WorkItemInstance.AllVersionsWorkItemFileManagementList;
        var Mode = workitemEndUser.WorkItemInstance.CurrentMode;
        loadFileAttachmentsGrid(FilesList, Mode);
        $("#txtAttachmentNameSearchField, #txtAttachmentTypeSearchField").on('keyup', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkItemAttachmentGrid').DataTable();
            var key = e.which;
            if (key === 9 || key === 16) {
                return false;
            }
            if ($('#txtAttachmentNameSearchField').val() !== "" && key === 16) {
                $("#txtAttachmentNameSearchField").focus();
            }
            SearchColumnName = $(this).parent().parent().data('headername');
            if (SearchColumnName === "AttachmentName") {
                txtAttachmentName = $('#txtAttachmentNameSearchField').val();
                txtAttachmentType = $('#txtAttachmentTypeSearchField').val();
                if (txtAttachmentType === undefined) {
                    txtAttachmentType = "";
                }
                SearchString = [txtAttachmentName, txtAttachmentType];
            }
            else if (SearchColumnName === "AttachmentType") {
                txtAttachmentName = $('#txtAttachmentNameSearchField').val();
                if (txtAttachmentName === undefined) {
                    txtAttachmentName = "";
                }
                txtAttachmentType = $('#txtAttachmentTypeSearchField').val();
                SearchString = [txtAttachmentName, txtAttachmentType];
            }
            var VersionType = $("input:radio[name='WorkItemInstance.WorkItemFileManagement.IsViewCurrentVersion']:checked").val();
            url = WebURL + 'WorkitemEnduser/GetWIAttachmentsSearchRecords';
            var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, versionType: VersionType };
            var Searchdata;
            $.post(url, params, function (data) {
                Searchdata = data;
                if (Searchdata != null) {
                    recordsearch = "Performed";
                    table.clear().rows.add(Searchdata).draw();
                }
                else {
                    recordsearch = "load";
                }
            });
        });
        $(document).on('click', '.DeleteWIFile', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var params;
            var table = $('#WorkItemAttachmentGrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkItemInstanceAttachmentID = data_row_table.WorkItemInstanceAttachmentID;
            var AttachmentName = data_row_table.AttachmentName;
            var VersionType = $("input:radio[name='WorkItemInstance.WorkItemFileManagement.IsViewCurrentVersion']:checked").val();
            if (Mode == "CreateWorkItem") {
                params = { attachmentName: data_row_table.AttachmentName, attachmentTypeName: data_row_table.AttachmentType, isFileorLink: data_row_table.IsAttachementFileOrURL }
                url = WebURL + 'WorkitemEnduser/DeleteAttachmentInCreateWI';
            }
            else {
                params = { workItemInstanceAttachmentID: WorkItemInstanceAttachmentID, versionType: VersionType }; // data to submit
                url = WebURL + 'WorkitemEnduser/DeleteAttachment';
            }
            var Searchdata;
            progress("1");
            $.post(url, params, function (data) {
                var message;
                if (data.status === "Success") {
                    //$('#fileAttachment_div').removeClass('hide');
                    //$('#fileAttachment_div').html('');
                    if (Mode == "EditWorkItem") {
                        message = Web_WorkItemInstanceAttachmentDeleteSuccess.replace("{0}", AttachmentName);
                        $('#WIEditSuccessMsg').removeClass('hide');
                        $('#WIEditSuccessMsg').html(message);
                        $('#WIEditSuccessMsg').removeClass('text-danger');
                        $('#WIEditSuccessMsg').addClass('txtcolourforestgreen');
                        setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                    }
                    Searchdata = data.WorkItemInstance.WorkItemFileManagementList;
                    recordsearch = "load";
                    table.clear().rows.add(Searchdata).draw();
                    if (workitemEndUser != null || workitemEndUser != undefined) {
                        if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                            workitemEndUser = JSON.parse(workitemEndUser);
                        }
                    }
                    if (workitemEndUser.WorkItemInstance.WorkItemFileManagementList === null || workitemEndUser.WorkItemInstance.WorkItemFileManagementList === undefined) {
                        workitemEndUser.WorkItemInstance.WorkItemFileManagementList = [];
                    }
                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = data.WorkItemInstance.WorkItemFileManagementList;
                }
                else if (data.status === "CompletedTasksExists") {

                    $('#CompletedTasksPopup').modal('show');
                    message = WorkItem_CompletedTaskPopupMsg.replace("{0}", AttachmentName);
                    $('.completedTasks-title').html(message);
                    var completedTasksList = data.WorkItemInstance.WorkitemAttachmentsRelatedTasksList;
                    if (completedTasksList.length > 0) {
                        for (var i = 0; i < completedTasksList.length; i++) {
                            $('#CompletedTasksTable > tbody').after('<ul class="completedTaskName"><li><tr><td>' + completedTasksList[i].TaskName + '</td></tr></li></ul>');
                        }
                    }
                }
                else {
                    message = Web_WorkItemInstanceAttachmentDeleteFailed;
                    $('#WIEditSuccessMsg').removeClass('hide');
                    $('#WIEditSuccessMsg').html(message);
                    $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                    $('#WIEditSuccessMsg').addClass('text-danger');
                    setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                }
                progress("2");
            });
        });
        $('#WorkItemAttachmentGrid tbody').on('click', 'input[type="checkbox"]', function (e) {
            var $row = $(this).closest('tr');
            var table = $("#WorkItemAttachmentGrid").DataTable();
            // Get row data
            if (this.checked) {
                $row.addClass('DownloadSelected');
            } else {
                $row.removeClass('DownloadSelected');
            }
        });
        $(document).on('click', '#downloadSelectedFiles', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkItemAttachmentGrid').DataTable();
            var rows = table.rows('.DownloadSelected').data();
            if (rows.length > 0) {
                $("#da").empty();
                var containerName = $("#txtWIInstanceID").val().trim();
                if (containerName.length < 3)
                    containerName = ('000' + containerName).slice(-3);
                for (i = 0; i < rows.length; i++) {
                    progress("1");
                    var AttachmentURL = rows[i].AttachmentURL;
                    AttachmentURL = encodeURIComponent(AttachmentURL);
                    var fileDirectory = rows[i].AttachmentTypeID;
                    var fName = rows[i].AttachmentName;
                    var VersionType = $("input:radio[name='WorkItemInstance.WorkItemFileManagement.IsViewCurrentVersion']:checked").val();
                    var params = { selectedFilesUrl: AttachmentURL, versionType: VersionType }; // data to submit
                    url = WebURL + 'WorkitemEnduser/DownloadAttachments';
                    $.ajaxSetup({ async: false });
                    $.get(url, params, function (data) {
                        downloadFile(data.snapshotTime, containerName.toString(), fileDirectory, fName, rows.length);
                        Searchdata = data.WorkItemFileManagementList;
                        recordsearch = "load";
                        table.clear().rows.add(Searchdata).draw();
                        progress("2");
                        $(".IsFileDownloadSelected").prop('checked', false);
                    });
                    $.ajaxSetup({ async: true });
                }
            }
            else {
                message = Web_WorkitemInstance_DownloadValidateMsg;
                $('#WIEditSuccessMsg').removeClass('hide');
                $('#WIEditSuccessMsg').removeClass('txtcolourforestgreen');
                $('#WIEditSuccessMsg').html(message);
                $('#WIEditSuccessMsg').addClass('text-danger');
                setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
            }
        });

        var downloadFile = function (data, containerName, fileDirectory, fName, rowsLength) {
            var sasUrl;
            var mydiv = document.getElementById("da");
            var blobStorageUri = azureUri;
            var token;
            $.ajax({
                url: WebURL + "/WorkitemEnduser/GetSASToken",
                type: 'GET',
                success: function (res) {
                    token = (res.charAt(0) == "?") ? res.substring(1) : res;
                }
            });

            var blobService = AzureStorage.createBlobServiceWithSas(blobStorageUri, token).withFilter(new AzureStorage.ExponentialRetryPolicyFilter());

            if (data != null) {
                sasUrl = blobService.getUrl(containerName, fileDirectory + '/' + fName, token, true, data);
            }
            else {
                sasUrl = blobService.getUrl(containerName, fileDirectory + '/' + fName, token, true);
            }
            fName = encodeURIComponent(fName);
            var contentDisposition = '&rscd=file; attachment; filename="' + fName + '"';
            sasUrl = sasUrl + contentDisposition;
            var aTag = document.createElement('a');
            aTag.setAttribute('href', sasUrl);
            aTag.setAttribute("download", fName);
            mydiv.appendChild(aTag);
            if ($("#da a").length == rowsLength) {
                $("#da a").each(function (index, elem) {
                    setTimeout(function () { elem.click(); }, index * 2000, index, elem);
                });
            }
        }

        $(document).on('change', '.versionType', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkItemAttachmentGrid').DataTable();
            var VersionType = $(this).val();
            var params = { versionType: VersionType }; // data to submit
            url = WebURL + 'WorkitemEnduser/ViewAttachmentsVersions';
            var Searchdata;
            $.post(url, params, function (data) {
                Searchdata = data;
                recordsearch = "Performed";
                table.clear().rows.add(Searchdata).draw();
            });
        });
        $(document).on('click', '.EditWIFile', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var params;
            var table = $('#WorkItemAttachmentGrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkItemInstanceAttachmentID = data_row_table.WorkItemInstanceAttachmentID;
            if (Mode == "CreateWorkItem") {
                params = { workItemInstanceAttachmentID: "0", attachmentName: data_row_table.AttachmentName, attachmentTypeName: data_row_table.AttachmentType, isFileOrLink: data_row_table.IsAttachementFileOrURL }
            }
            else {
                params = { workItemInstanceAttachmentID: WorkItemInstanceAttachmentID }
            }
            progress("1");
            $.ajax('EditWIFileInformation', {
                type: 'POST',
                data: params,
                dataType: 'html',
                success: function (data, status, xhr) {
                    progress("2");

                    $(".DeleteWIFile").prop("disabled", true);
                    $(".DeleteWIFile").css("cursor", "not-allowed");

                    $('#fileAttachment_div').show();
                    $('#fileAttachment_div').removeClass('hide');
                    $('#fileAttachment_div').html('');
                    $('#fileAttachment_div').html(data);
                    $("#IsAttachurl").attr("disabled", true);
                    $('#IsAttachurl').css("cursor", 'not-allowed');
                    $('#fileEditButtonsDiv').removeClass('hide');
                    $('#fileCreateButtonsDiv').addClass('hide');
                }
            });
        });
        $(document).on('click', '.wiAttachmentNameDownload', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $("#da").empty();
            var table = $('#WorkItemAttachmentGrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var containerName = $("#txtWIInstanceID").val().trim();
            if (containerName.length < 3)
                containerName = ('000' + containerName).slice(-3);
            var fileDirectory = data_row_table.AttachmentTypeID;
            var fName = data_row_table.AttachmentName;
            var IsAttachmentFileOrURL = data_row_table.IsAttachementFileOrURL;
            var AttachmentURL = data_row_table.AttachmentURL;
            AttachmentURL = encodeURIComponent(AttachmentURL);
            var Link = data_row_table.FilePath;
            var VersionType = $("input:radio[name='WorkItemInstance.WorkItemFileManagement.IsViewCurrentVersion']:checked").val();
            if (IsAttachmentFileOrURL === "File") {
                var params = { selectedFilesUrl: AttachmentURL, versionType: VersionType }; // data to submit
                url = WebURL + 'WorkitemEnduser/DownloadAttachments';
                progress("1");
                $.ajaxSetup({ async: false });
                $.get(url, params, function (data) {
                    downloadFile(data.snapshotTime, containerName.toString(), fileDirectory, fName, 1);
                    Searchdata = data.WorkItemFileManagementList;
                    recordsearch = "load";
                    table.clear().rows.add(Searchdata).draw();
                    progress("2");
                });
                $.ajaxSetup({ async: true });
            }
            else {
                window.open(Link);
            }
        });
        $(document).on('click', '#btnOkCompletedTasks', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(".completedTaskName").empty();
            $('#CompletedTasksPopup').modal('hide');
        });
    }
};

//BFly-3513 - Method Start
function CheckMandatoryResponsibility(src) {
    var PostUrl = WebUrl + "WorkitemEnduser/CheckIsMandatoryRespResources";
    $.ajax({
        type: 'POST',  // http method
        url: PostUrl,
        //data: params,
        async: false,
        success: function (data) {
            if (data === true) {
                $('#btnresourceallocnext').attr("disabled", true);
                $('#btnresourceallocnext').css("cursor", 'not-allowed');
                $('#btnresourceallocnext').addClass('Button-disable');
                $('#btnresourceallocnext').removeClass('Button');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps, .productMaster').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps, .productMaster').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');

                var msg = "Mandatory assignment/s must be completed";
                if (src === "2") {
                    $('#wIRespAdd').removeClass('hide');
                    $('#wIRespAdd').removeClass('txtcolourforestgreen');
                    $('#wIRespAdd').addClass('text-danger');
                    $('#wIRespAdd').html(msg);
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#wIRespAdd").html(''); }, Web_MsgTimeOutValue);
                }
                //else {
                //    $('#WorkitemStatusChangeMsg').removeClass('hide');
                //    $('#WorkitemStatusChangeMsg').removeClass('txtcolourforestgreen');
                //    $('#WorkitemStatusChangeMsg').addClass('text-danger');
                //    //$('#WorkitemStatusChangeMsg').html(msg);
                //    //window.scrollTo(0, 0);
                //    //setTimeout(function () { $("#WorkitemStatusChangeMsg").html(''); }, Web_MsgTimeOutValue);
                //}
                return false;
            }
            else {
                $('#btnresourceallocnext').attr("disabled", false);
                $('#btnresourceallocnext').css("cursor", 'pointer');
                $('#btnresourceallocnext').removeClass('Button-disable');
                $('#btnresourceallocnext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps, .productMaster').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
            }

        }
    });
    return true;
}
//BFly-3513 - Method End


function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function LoadSPINPrivileges(UserPrivilege) {
    if (UserPrivilege !== null && UserPrivilege !== undefined) {

        if (UserPrivilege.LinkTitle === true) {
            LinkTitle = true;
        }
        else {
            LinkTitle = false;
        }
        if (UserPrivilege.UnLinkTitle === true) {
            UnLinkTitle = true;
        }
        else {
            UnLinkTitle = false;
        }
        if (UserPrivilege.RefreshData === true) {
            RefreshData = true;
        }
        else {
            RefreshData = false;
        }
        if (UserPrivilege.IsLinkToBookID === true) {
            IsLinkedToBookId = true;
        }
        else {
            IsLinkedToBookId = false;
        }
        if (UserPrivilege.ViewWorkItemResourceAllocation === true) {
            ViewWorkItemResourceAllocation = true;
        }
        else {
            ViewWorkItemResourceAllocation = false;
        }
    }
}
function ValidateSPINPrivileges() {

    if (LinkTitle || UnLinkTitle || RefreshData) {
        // SPIN privileges at ProductMaster in workItem Edit based on privilege under WorkItem End User
        if (RefreshData) {
            $("#btnwiRefreshProductMaster").removeClass("hide");
        }
        else {
            $("#btnwiRefreshProductMaster").addClass("hide");
        }
        if (UnLinkTitle) {
            $("#UnLinkProductMaster").removeClass("hide");
        }
        else {
            $("#UnLinkProductMaster").addClass("hide");
        }
        if (LinkTitle) {
            $("#txtBookID").removeAttr("disabled");
            //$("#btnwiSearchProductMaster").removeAttr("disabled");
            $("#lblBookIddiv").addClass("required");
            $("#btnwiSearchProductMaster, #txtBookID").removeAttr('title');
            //$("#btnwiSearchProductMaster").css('cursor', 'pointer');
        }
        else {
            $("#btnwiSearchProductMaster, #txtBookID").attr('title', Web_WorkItemLinkTitlePrivilege);
            $("#txtBookID,#btnwiSearchProductMaster").attr("disabled", "disabled");
            $("#btnwiSearchProductMaster,#txtBookID").css('cursor', 'not-allowed');
            $("#lblBookIddiv").removeClass("required");
        }
    }
}
var workitem;
//Dasboard Workitem View 
var ViewWorkitem = {
    init: function (args) {
        this.DashboardWorkitem = args.WorkitemViewModel;
        this.WebURL = args.URL;
        WebURL = this.WebURL;
        this.Mode = args.Mode;
        this.loadWorkitemGrid();
        var workitemname = args.workitemname;
        workItemMode = args.Mode;
        if (this.Mode == "WorkitemInsSaveSuccess") {
            if (performance.navigation.type == 1) {
                //RedirectUrl = this.WebUrl + 'Workflow/Task/GetMasterTaskList';
                //window.location.replace(RedirectUrl);
            } else {
                var msg = Web_WorkitemInstanceSaveSuccess.replace("{0}", workitemname);
                $('#workspaceworkitemdashboardmsgs').removeClass('hide');
                $('#workspaceworkitemdashboardmsgs').html(msg);
                setTimeout(function () { $("#workspaceworkitemdashboardmsgs").html(''); }, Web_MsgTimeOutValue);
            }
        }
        if (this.DashboardWorkitem != null) {
            $('#WorkitemViewgrid tfoot th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') == true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var SearchId = id + 'SearchField';
                    // var InputSearchbox = '<input type="text" class="form-control textbox" id="' + SearchId + '" placeholder="Search by ' + title + '" />';
                    var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            $('#WorkspaceViewgrid tfoot th').hide();
        }
        //this.searchGrid({ id: 'WorkitemViewgrid', url: 'WorkflowEnduser/GetWorkitemSearchRecords' });
        this.searchGrid({ id: 'WorkitemViewgrid', url: WebURL + 'WorkflowEnduser/GetWorkitemSearchRecords' });
    },



    loadWorkitemGrid: function () {
        var data = this.DashboardWorkitem;
        var table = $('#WorkitemViewgrid').DataTable({
            "stripeClasses": [],
            "destroy": true,
            "processing": false, // for show progress bar
            //"serverSide": true, // for process server side
            "orderMulti": false,// for disable multiple column at once
            "filter": false,
            "searching": false,
            "order": [8, "asc"],
            // this is for disable filter (search box)
            "language": {
                "emptyTable": function (data) {
                    if ((recordsearch == "load" && data == "0") || (recordsearch == "load" && data == "")) {
                        return Web_NoWorkitemsExists;
                    }
                    else if ((recordsearch == "Performed" && data == "0" && $('#txtWorkitemSearchField').val() == "" && $('#txtRelatedWorkspaceSearchField').val() == "" && $('#txtWorkitemTemplateSearchField').val() == "" && $('#txtStatusSearchField').val() == "")) {
                        return Web_NoWorkitemsExists;
                    }
                    else {
                        return Web_Noworkitems;
                    }
                }
            },
            "data": data,
            "createdRow": function (row, data, dataIndex) {
                //if (data.Status == false) {
                //    $(row).addClass('greyoutf');
                //    $(row).find('.aicon').css("opacity", "0.5");
                //    $(row).find('.dicon').css("opacity", "0.5");
                //}
            },
            "columns": [

                { "data": "WorkItemInstanceID", "name": "ID", "className": "" },
                { "data": "WorkItemInstanceName", "name": "Work item", "className": "col-md-2 minwidth", "orderable": true },
                { "data": "WorkspaceInstanceName", "name": "Related Workspace", "className": "col-md-2 minwidth", "orderable": true },
                { "data": "WorkItemTemplateName", "name": "Work item template", "className": "col-md-2 minwidth", "orderable": true },
                {
                    "data": "LastUpdatedDate", "name": "Last Updated On", "orderable": true, "type": "ce_datetime", "className": "col-md-2 text-center minwidth",
                    render: function (data, type, row) {
                        return moment.utc(data.replace(/-/g, ' ')).format('DD-MMM-YYYY HH:mm');//(moment.utc(data, 'YYYY-MM-DDTHH:mm:ssZ').format("DD-MMM-YYYY HH:mm"));  
                    }
                },
                {
                    "data": "CreatedBy", "name": "Created by", "className": "col-md-2 text-center minwidth", "orderable": true

                },
                {
                    "data": "Status", "name": "Status", "className": "col-md-1 text-center minwidth", "orderable": true
                },
                {
                    data: null,
                    defaultContent: '',
                    name: null,
                    className: "col-md-1 text-center",
                    orderable: false,
                    render: {
                        display: function (data, type, row) {
                            return "<a title='Edit' style='cursor:pointer;' class='editWorkitem'><span class='edit-img'></span></a>&nbsp;&nbsp;&nbsp;<a title='Link to a work item' style='cursor:pointer;' class=''><span class='linkrel link-img'></span></a>&nbsp;&nbsp;&nbsp;<a title='Workflows' style='cursor:pointer;' class='viewWorkflows'><span class='fab fa-stack-overflow'></span></a>&nbsp;&nbsp;&nbsp;<a title='' style='cursor:pointer;' class=''><span class='far fa-copy hide'></span></a>";
                        }
                    }
                },
                { "data": "WorkItemInstanceName", "name": "Work item", "className": 'col-md-2', 'visible': false }
            ],
            columnDefs: [
                {
                    "targets": [1],
                    render: function (data, type, row) {
                        // return '<span style="cursor: pointer;" class="ViewWorkitem linkcolour">' + data + '</span>';
                        if (row.IsWorkitemLate === true && row.IsWorkitemProblem === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-triangle" title="' + Web_ProblemTask + '"></span >&nbsp;&nbsp;<span style="color: red;" class="fa fa-exclamation-circle" title="' + Web_TaskLate + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewWorkitem linkcolour">' + data + '</span>';
                        }
                        else if (row.IsWorkitemLate === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-circle" title="' + Web_TaskLate + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewWorkitem linkcolour">' + data + '</span>';
                        }
                        else if (row.IsWorkitemProblem === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-triangle" title="' + Web_ProblemTask + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewWorkitem linkcolour">' + data + '</span>';
                        }
                        else {
                            return '<span style="cursor: pointer;" class="ViewWorkitem linkcolour">' + data + '</span>';
                        }
                    }
                },
                {
                    type: 'html',
                    targets: [2],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewRelatedWorkspace linkcolour">' + data + '</span>';
                    }
                },
                {
                    type: 'html',
                    targets: [3],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewWorkitemtemplate linkcolour">' + data + '</span>';
                    }
                }
                //{
                //    "targets": [6],
                //    render: function (data, type, row) {
                //        return data;
                //        // return data === true ? '<span class="aicon">A</span>' : '<span class="dicon">D</span>';
                //    }
                //}
            ],
            "fnDrawCallback": function (oSettings) {
                //For applying Prieviliges
                WorkitemInstancePermissionMap();
            }
        });
        $.fn.dataTableExt.oSort['date-pre'] = function (value) {
            return Date.parse(value.replace(/-/g, ' '));
            //moment(dt, "DD-MMM-YYYY HH:mm");
        };
        $.fn.dataTableExt.oSort['date-asc'] = function (a, b) {
            return a - b;
        };
        $.fn.dataTableExt.oSort['date-desc'] = function (a, b) {
            return b - a;
        };
        $(document).on('click', '.editWorkitem', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkitemViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkitemId = data_row_table.WorkItemInstanceID;
            var url = "/WorkitemEnduser/EditWorkitem?workitemID=" + WorkitemId;
            window.location.href = url;
        });
        $(document).on('click', '.viewWorkflows', function (e) {

            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkitemViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkitemId = data_row_table.WorkItemInstanceID;
            var WorkspaceId = data_row_table.WorkspaceInstanceID;
            var url = "WorkflowEndUser/ViewWorkflow?workspaceID=" + WorkspaceId + "&workItemID=" + WorkitemId;
            window.location.href = WebURL + url;
        });
        $(document).on('click', '.ViewWorkitemtemplate', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkitemViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkitemId = data_row_table.WorkItemTemplateID;
            var url = "/Workitem/View?WITemplateId=" + WorkitemId;
            window.location.href = url;
        });
        this.sortGrid({ id: 'WorkitemViewgrid', url: '/WorkflowEnduser/GetWorkitemSearchRecords' });
    },
    searchGrid: function (args) {
        var table = $('#' + args.id).DataTable();
        table.columns().every(function () {
            var that = this;
            $('input', this.footer()).on('keyup change', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var table = $('#WorkitemViewgrid').DataTable();
                var key = e.which;
                if (key === 9 || key === 16) {
                    return false;
                }

                if ($('#txtWorkitemSearchField').val() !== "" && key === 16) {
                    $("#txtRelatedWorkspaceSearchField").focus();
                }
                var txtWorkitem = $('#txtWorkitemSearchField').val();
                var txtRelWorkspace = $('#txtRelatedWorkspaceSearchField').val();
                var txtWorkitemTemplate = $('#txtWorkitemTemplateSearchField').val();
                var txtStatus = $('#txtStatusSearchField').val();

                url = args.url;
                SearchColumnName = $(this).parent().parent().data('headername');
                if (SearchColumnName === "Workitem" || SearchColumnName === "Related Workspace" || SearchColumnName === "Work item template" || SearchColumnName === "Status") {
                    SearchString = [txtWorkitem, txtRelWorkspace, txtWorkitemTemplate, txtStatus];
                } else {
                    SearchString = this.value;
                }

                var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
                var Searchdata;
                $.post(url, params, function (data) {
                    Searchdata = data;
                    recordsearch = "Performed";
                    table.clear().rows.add(Searchdata).draw();
                });
            });
        });
    },
    sortGrid: function (args) {
        $('#WorkitemViewgrid th').click(function (e) {
            if ($(this).hasClass("sortheader")) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var colIndex = $(this).index();
                if (colIndex === 1) {
                    var currentElement = $(this).attr('id');
                    var sortOrder;
                    if (currentElement !== null && currentElement !== "") {
                        if ($(this).hasClass("sorti_desc")) {
                            sortOrder = "asc";
                        }
                        else if ($(this).hasClass("sorti_asc")) {
                            sortOrder = "desc";
                        }
                        else {
                            sortOrder = "asc";
                        }
                        sortByWorkItemColumns(colIndex, sortOrder);
                        if (sortOrder === "asc") {
                            $("#" + currentElement).addClass("sorti_asc");
                            $("#" + currentElement).removeClass("sorti_desc");
                        }
                        else if (sortOrder === "desc") {
                            $("#" + currentElement).addClass("sorti_desc");
                            $("#" + currentElement).removeClass("sorti_asc");
                        }
                    }
                }
            }
        });
    }
};

//Product Master init method
var ProductInformationList
var WorkItemProductMaster = {
    init: function (args) {
        //this.WorkItemEndUser = args.WorkItemEndUser;
        this.WebURL = args.Url;
        WebUrl = args.Url;
        LoadProductGrid = args.LoadProductGrid;
        UserPrivilege = args.UserPrivilege;
        LoadSPINPrivileges(UserPrivilege);
        ValidateSPINPrivileges();
        if (LoadProductGrid) {
            workitemEndUser = args.WorkItemEndUser;
            ProductInformationList = workitemEndUser.WorkItemInstance.ProductMaster.ProductDetails;
            //Loading grid
            ProductInformationKendoGrid(ProductInformationList);
        }
    }
};
//Product Master click events
$(document).ready(function (e) {
    $('#txtBookID').val('');
    DisableProductSearchButton();
    //Search button click event
    $(document).on('click', '#btnwiSearchProductMaster', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var params = { workItemID: $('#WorkitemInstanceID').val(), bookID: $('#txtBookID').val().trim() }; // data to submit 
        progress("1");
        $.ajax('GetBookIDDetails', {
            type: 'GET',
            data: params,
            dataType: 'html',
            success: function (data, status, xhr) {
                var message = "";
                $("#productInformationDiv").html('');
                $("#productInformationDiv").html(data);
                if ($("#hdnProductAPIStatus").val() == "Failed") {
                    message = Web_WorkitemProductAPIFailed
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $("#productInformationDiv").html('');
                    $('#productInformationDiv').addClass('hide');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if ($("#hdnProductAPIStatus").val() == "BookNotExists") {
                    message = Web_WorkitemBookIDNotExists
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $("#productInformationDiv").html('');
                    $('#productInformationDiv').addClass('hide');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if ($("#hdnProductAPIStatus").val() == "SUCCESS") {
                    $('#WIProductMasterMsg').html('');
                    $('#WIProductMasterMsg').addClass('hide');
                    $("#productInformationDiv").html('');
                    $("#productInformationDiv").html(data);
                    $('#productInformationDiv').removeClass('hide');
                }
                progress("2");
            }
        });
    });
    //Cancel button click event
    $(document).on('click', '#btnwiCancelProductMaster', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#productInformationDiv').addClass('hide');
        $('#txtBookID').val('');
    });
    //Link button click
    $(document).on('click', '#btnwiLinkProductMaster', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#WILinkBookAlertModal').modal('show');
    });
    //Click event for linking
    $(document).on('click', '#btnWILinkBookYes', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#txtViewBookIDInfo").attr("readonly", false);
        var bookID = $('#txtViewBookIDInfo').val().trim();
        $("#txtViewBookIDInfo").attr("readonly", true);
        var params = { bookID: bookID };
        $('#WILinkBookAlertModal').modal('hide');
        progress("1");
        $.ajax('SaveLinkToWorkItem', {
            type: 'GET',
            data: params,
            dataType: 'html',
            success: function (data, status, xhr) {
                progress("2");
                $("#WorkitemProductDiv").html('');
                $("#WorkitemProductDiv").html(data);
                var message = '';
                if ($("#hdnIsLinkStatus").val() == "SUCCESS") {
                    if (document.getElementsByClassName('grouptabs').length > 0) {
                        document.getElementsByClassName('grouptabs')[0].click();
                    }
                    message = WorkItem_LinkSuccess;
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('text-danger');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('txtcolourforestgreen');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if ($("#hdnIsLinkStatus").val() == "CONCURRENCY") {
                    message = Web_Concurrency;
                    $('#productInformationDiv').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else {
                    message = WorkItem_LinkFailure;
                    $('#productInformationDiv').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
            },
            error: function () {
                progress("2");
                message = WorkItem_LinkFailure;
                $('#productInformationDiv').removeClass('hide');
                $('#WIProductMasterMsg').removeClass('hide');
                $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                $('#WIProductMasterMsg').html(message);
                $('#WIProductMasterMsg').addClass('text-danger');
                window.scrollTo(0, 0);
                setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
            }
        });
    });
    //Refresh button click event.
    $(document).on('click', '#btnwiRefreshProductMaster', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var bookID = $('#txtViewBookID').val().trim();
        var params = { bookID: bookID };
        progress("1");
        $.ajax('RefreshProductMasterData', {
            type: 'GET',
            data: params,
            dataType: 'json',
            success: function (data, status, xhr) {
                progress("2");
                if (data == "success") {
                    if (document.getElementsByClassName('grouptabs').length > 0) {
                        document.getElementsByClassName('grouptabs')[0].click();
                    }
                    message = WorkItem_RefreshProductMasterSuccess;
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('text-danger');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('txtcolourforestgreen');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if (data == "CONCURRENCY") {
                    message = Web_Concurrency;
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if (data == "ProductAPIFailed") {
                    message = WorkItem_RefreshProductMasterFailure;
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
            },
            error: function () {
                progress("2");
                message = WorkItem_RefreshProductMasterFailure;
                $('#WIProductMasterMsg').removeClass('hide');
                $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                $('#WIProductMasterMsg').html(message);
                $('#WIProductMasterMsg').addClass('text-danger');
                window.scrollTo(0, 0);
                setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
            }
        });
    });
    $(document).on('click', '#btnWILinkBookNo', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#WILinkBookAlertModal').modal('hide');
    });
    //End of link
    //Unlink button logics
    $(document).on('click', '#UnLinkProductMaster', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#WIUnLinkBookAlertModal').modal('show');
    });
    $(document).on('click', '#btnWIUnLinkBookYes', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#WIUnLinkBookAlertModal').modal('hide');
        progress("1");
        $.ajax('UnLinkProductMasterBookID', {
            type: 'POST',
            dataType: 'html',
            success: function (data, status, xhr) {
                progress("2");
                var message = "";
                $("#WorkitemProductDiv").html('');
                $("#WorkitemProductDiv").html(data);
                if ($("#hdnIsLinkStatus").val() == "Failed") {
                    message = WorkItem_UnLinkFailure;
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if ($("#hdnIsLinkStatus").val() == "CONCURRENCY") {
                    message = Web_Concurrency;
                    $('#productInformationDiv').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('text-danger');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                }
                else if ($("#hdnIsLinkStatus").val() == "SUCCESS") {
                    $('#txtBookID').val('');
                    if (document.getElementsByClassName('grouptabs').length > 0) {
                        document.getElementsByClassName('grouptabs')[0].click();
                    }
                    message = WorkItem_UnLinkSuccess;
                    $('#WIProductMasterMsg').removeClass('hide');
                    $('#WIProductMasterMsg').removeClass('text-danger');
                    $('#WIProductMasterMsg').html(message);
                    $('#WIProductMasterMsg').addClass('txtcolourforestgreen');
                    window.scrollTo(0, 0);
                    setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
                    DisableProductSearchButton();
                }
            },
            error: function () {
                progress("2");
                message = WorkItem_UnLinkFailure;
                $('#WIProductMasterMsg').removeClass('hide');
                $('#WIProductMasterMsg').html(message);
                $('#WIProductMasterMsg').addClass('text-danger');
                $('#WIProductMasterMsg').removeClass('txtcolourforestgreen');
                window.scrollTo(0, 0);
                setTimeout(function () { $("#WIProductMasterMsg").html(''); }, Web_MsgTimeOutValue);
            }
        });
    });

    $(document).on('click', '#btnWIUnLinkBookNo', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#WIUnLinkBookAlertModal').modal('hide');
    });
    //End of unink logic
    //Link to SMART books logic
    $(document).on('click', '#LinkToSmartBooks', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var bookID = $('#txtViewBookID').val().trim();
        var params = { bookID: bookID };
        $.ajax('GetLinkForSmartBooks', {
            type: 'GET',
            dataType: 'json',
            data: params,
            success: function (data, status, xhr) {
                if (data != "") {
                    window.open(data);
                }
            },
            error: function () {

            }
        });
    });

    //Book id textbox validations
    $(document).on('paste', '#txtBookID', function (event) {
        if (event.originalEvent.clipboardData.getData('Text').match(/[^0-9- ]/)) {
            event.preventDefault();
            var labelName = $(this).data('validatelabel');
            var CurrentId = $(this).attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyNumeric.replace("{0}", labelName) + '</span>');
            event.preventDefault();
        }
        else {
            $('.errmsg' + CurrentId).remove();
            $('#btnwiSearchProductMaster').removeClass('Button-disable');
            $('#btnwiSearchProductMaster').addClass('Button');
            $('#btnwiSearchProductMaster').attr("disabled", false);
            $("#btnwiSearchProductMaster").css('cursor', 'pointer');
        }
    });
    $(document).on('keypress', '#txtBookID', function (e) {
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var keyCode = e.which;
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (!(keyCode >= 48 && keyCode <= 57)) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyNumeric.replace("{0}", labelName) + '</span>');
            e.preventDefault();
            return false;
        }
        else if (value.length > allowedmaxlength - 1 && keyCode != 8 && keyCode != 0) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
            e.preventDefault();
            return false;
        }
        else {
            $('.errmsg' + CurrentId).remove();
            $('#btnwiSearchProductMaster').removeClass('Button-disable');
            $('#btnwiSearchProductMaster').addClass('Button');
            $('#btnwiSearchProductMaster').attr("disabled", false);
            $("#btnwiSearchProductMaster").css('cursor', 'pointer');
        }
    });
    $(document).on('focusout', '#txtBookID', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        $('#WIProductMasterMsg').html('');
        if (value === "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' ');
            $('#btnwiSearchProductMaster').removeClass('Button');
            $('#btnwiSearchProductMaster').addClass('Button-disable');
            $('#btnwiSearchProductMaster').attr("disabled", true);
            $("#btnwiSearchProductMaster").css('cursor', 'not-allowed');
        }
        else {
            if (value >= 1) {
                if (value.length > allowedmaxlength) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                    $('#btnwiSearchProductMaster').removeClass('Button');
                    $('#btnwiSearchProductMaster').addClass('Button-disable');
                    $('#btnwiSearchProductMaster').attr("disabled", true);
                    $("#btnwiSearchProductMaster").css('cursor', 'not-allowed');
                }
                else {
                    $('.errmsg' + CurrentId).remove();
                    $('#btnwiSearchProductMaster').removeClass('Button-disable');
                    $('#btnwiSearchProductMaster').addClass('Button');
                    $('#btnwiSearchProductMaster').attr("disabled", false);
                    $("#btnwiSearchProductMaster").css('cursor', 'pointer');
                }
            }
            else {
                $('#btnwiSearchProductMaster').removeClass('Button');
                $('#btnwiSearchProductMaster').addClass('Button-disable');
                $('#btnwiSearchProductMaster').attr("disabled", true);
                $("#btnwiSearchProductMaster").css('cursor', 'not-allowed');
            }
        }
    });
    //End of book id validations
});
function ProductInformationKendoGrid(ProductInformationList) {
    dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                options.success(ProductInformationList);
            },
            parameterMap: function (options, operation) {
                if (operation !== "read" && options.models) {
                    return { models: kendo.stringify(options.models) };
                }
            }
        },
        batch: true,
        pageSize: 5,
        schema: {
            model: {
                id: "id",
                fields: {
                    FormatType: { from: "FormatType", type: "string", editable: false },
                    FormatSubType: { from: "FormatSubType", type: "string", editable: false },
                    ISBN: { from: "ISBN", type: "string", editable: false },
                    AccessID: { from: "AccessID", type: "string", editable: false },
                    FulfillmentModel: { from: "FulfillmentModel", type: "string", editable: false },
                    SSIN: { from: "SSIN", type: "string", editable: false }
                }
            }
        }
    });
    var grid = $("#ProductInformationKendoGrid").kendoGrid({
        dataSource: dataSource,
        pageSize: 5,
        height: 300,
        scrollable: true,
        sortable: true,
        filterable: {
            extra: false,
            operators: {
                string: {
                    contains: "Contains"
                }
            }
        },
        pageable: {
            input: true,
            numeric: false
        },
        columns: [
            { field: "FormatType", title: "Format Type", width: "50px" },
            { field: "FormatSubType", title: "Format Subtype", width: "50px" },
            { field: "ISBN", title: "ISBN", width: "50px" },
            { field: "AccessID", title: "Access ID", width: "50px" },
            { field: "FulfillmentModel", title: "Fullfillment Model", width: "50px" },
            { field: "SSIN", title: "SSIN", width: "50px" }
        ],
        noRecords: {
            template: "No records exist"
        }
    });
}
function DisableProductSearchButton() {
    $('#txtBookID').val('');
    $('#btnwiSearchProductMaster').removeClass('Button');
    $('#btnwiSearchProductMaster').addClass('Button-disable');
    $('#btnwiSearchProductMaster').attr("disabled", true);
    $("#btnwiSearchProductMaster").css('cursor', 'not-allowed');
}
//Use this if needed only workitem code
$(document).ready(function (e) {
    var Usernamevalue;
    var Responsibilityvalue;
    var SelectedResponsbility;
    var txtworkItemName;
    var txtworkItemTemplateName;
    $('#relatewswis').attr("disabled", true);
    $('#relatewswis').css("cursor", 'not-allowed');
    $('#relatewswis').addClass('Button-disable');
    $('#relatewswis').removeClass('Button');
    $('#AddingWIWSRelationship').attr("disabled", true);
    $('#AddingWIWSRelationship').css("cursor", 'not-allowed');
    $('#AddingWIWSRelationship').addClass('Button-disable');
    $('#AddingWIWSRelationship').removeClass('Button');
    var RelWSselectedIndex = $('#ddlrelatedwspaceInstance option:selected').index();
    var WITempselectedIndex = $('#ddlwITemplate option:selected').index();
    var WIselectedfindiv = $('#ddlwIfindivsion option:selected').index();
    var WIselectedSAGEOwn = $('#ddlwISAGEOwner option:selected').index();
    var WIInstanceName = $("#txtWIInstanceName").val();
    var defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
    if (workitemEndUser != null) {
        if (workitemEndUser.WorkItemInstance != null) {
            if (workitemEndUser.WorkItemInstance.CurrentMode === "CreateWorkItem") {
                if ($('#wrkItemInfo').hasClass("active")) {
                    $("#displaytext").html("Step 1 - Basic information");
                    if (WIInstanceName.trim() == "" || RelWSselectedIndex == 0 || WITempselectedIndex == 0 || WIselectedSAGEOwn == 0 || WIselectedSAGEOwn == 0) {
                        $('#btnbasicinfonext').attr("disabled", true);
                        $('#btnbasicinfonext').css("cursor", 'not-allowed');
                        $('#btnbasicinfonext').addClass('Button-disable');
                        $('#btnbasicinfonext').removeClass('Button');
                        $('.resourceAlloc').addClass('disbaleli');
                        $('.relatedWrkItem').addClass('disbaleli');
                        $('.metadatagrps, .productMaster').addClass('disbaleli');
                        $('.attachments').addClass('disbaleli');
                        $('.WIbillingRates').addClass('disbaleli');
                        $('.WIbillingRates').addClass('disbaleli');
                        $('#resourceAllocation').css('cursor', 'default');
                        $('#relatedWrkItem').css('cursor', 'default');
                        $('#attachments').css('cursor', 'default');
                    }
                    else if (WIInstanceName.trim() != "" && RelWSselectedIndex > 0 && WITempselectedIndex > 0 && WIselectedSAGEOwn > 0 && WIselectedSAGEOwn > 0) {
                        $('.resourceAlloc').removeClass('disbaleli');
                        $('.relatedWrkItem').removeClass('disbaleli');
                        $('.metadatagrps, .productMaster').removeClass('disbaleli');
                        $('.attachments').removeClass('disbaleli');
                        $('.WIbillingRates').removeClass('disbaleli');
                        $('#btnbasicinfonext').attr("disabled", false);
                        $('#btnbasicinfonext').css("cursor", 'pointer');
                        $('#btnbasicinfonext').addClass('Button');
                        $('#btnbasicinfonext').removeClass('Button-disable');
                    }
                    else {
                        $('.resourceAlloc').removeClass('disbaleli');
                        $('.relatedWrkItem').removeClass('disbaleli');
                        $('.metadatagrps, .productMaster').removeClass('disbaleli');
                        $('.attachments').removeClass('disbaleli');
                        $('.WIbillingRates').removeClass('disbaleli');
                        $('#btnbasicinfonext').attr("disabled", true);
                        $('#btnbasicinfonext').addClass('Button-disable');
                        $('#btnbasicinfonext').removeClass('Button');
                    }
                }
            }
            else if (workitemEndUser.WorkItemInstance.CurrentMode === "EditWorkItem") {
                if (WIInstanceName.trim() != null && WIInstanceName.trim() != "" && RelWSselectedIndex > 0 && WITempselectedIndex > 0 && WIselectedfindiv > 0 && WIselectedSAGEOwn > 0) {
                    $('#btnbasicinfonext').attr("disabled", false);
                    $('#btnbasicinfonext').addClass('Button');
                    $('#btnbasicinfonext').removeClass('Button-disable');
                    $('.resourceAlloc').removeClass('disbaleli');
                    $('.relatedWrkItem').removeClass('disbaleli');
                    $('.metadatagrps, .productMaster').removeClass('disbaleli');
                    $('.attachments').removeClass('disbaleli');
                    $('.WIbillingRates').removeClass('disbaleli');
                    $('#resourceAlloc').css('cursor', 'pointer');
                    $('#resourceAllocation').css('cursor', 'pointer');
                }
                else if (WIInstanceName.trim() == null || WIInstanceName.trim() == "" || RelWSselectedIndex == 0 || WITempselectedIndex == 0 || WIselectedfindiv == 0 || WIselectedSAGEOwn == 0) {
                    $('#btnbasicinfonext').attr("disabled", true);
                    $('#btnbasicinfonext').addClass('Button-disable');
                    $('#btnbasicinfonext').removeClass('Button');
                    $('.resourceAlloc').addClass('disbaleli');
                    $('.relatedWrkItem').addClass('disbaleli');
                    $('.metadatagrps, .productMaster').addClass('disbaleli');
                    $('.attachments').addClass('disbaleli');
                    $('.WIbillingRates').addClass('disbaleli');
                    $('#resourceAllocation').css('cursor', 'default');
                    $('#relatedWrkItem').css('cursor', 'default');
                    $('#metadatagrps, .productMaster').css('cursor', 'default');
                    $('#attachments').css('cursor', 'default');
                }
                //$('.lblWorkspace').removeClass('required');
                //$('.lblWITemplate').removeClass('required');
            }
        }
    }

    else {
        $("#displaytext").html("Step 1 - Basic information");
    }

    $(".nav-tabs > li").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var wrkItemInfo = $(this).hasClass("wrkItemInfo");
        var resourceAlloc = $(this).hasClass("resourceAlloc");
        var relatedWrkItem = $(this).hasClass("relatedWrkItem");
        var metadatagrps = $(this).hasClass("metadatagrps");
        var attachments = $(this).hasClass("attachments");
        var billingRates = $(this).hasClass("WIbillingRates");
        var productMaster = $(this).hasClass("productMaster");
        var tab;
        var IsValid = true;
        //Tabs click based on mode
        if (workItemMode === "CreateWorkItem") {
            if (wrkItemInfo) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step1';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 1 - Basic information");
                    CheckMandatoryResponsibility("2");
                }
                return false;
            }
            else if (resourceAlloc) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step2';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 2 - Resource allocation");
                    CheckMandatoryResponsibility("2");
                }
                return false;
            }
            else if (relatedWrkItem) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step3';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 3 - Related work items");
                    $("#relatedRelationship").empty();
                    $("#relatedwiwsddl").empty();
                    $("#relatedRelationship").prepend(defaultOpt);
                    $("#relatedwiwsddl").prepend(defaultOpt);
                }
                return false;
            }
            else if (metadatagrps) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step4';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 4 - Metadata groups");
                }
                return false;
            }
            else if (attachments) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step5';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 5 - Work item attachments ");
                }
                return false;
            }
            else if (billingRates) {
                tab = 'step6';
                $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                $("#displaytext").html("Step 6 - Billing rates ");
                if ($(this).hasClass("LoadWIBillingRates")) {
                    GetWorkItemBillingRates();
                }
                var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
                if (billingratestype === "Inherited") {
                    BindRelatedWorkItems();
                    GetTasksBillingrates();
                }
                BillingRatesValidations();
                return false;
            }
        }
        else if (workItemMode === "EditWorkItem" || workItemMode === "Relatedworkitems") {
            if (wrkItemInfo) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step1';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 1 - Basic information");
                    CheckMandatoryResponsibility("2");
                }
                return false;
            }
            else if (resourceAlloc) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step2';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 2 - Resource allocation");
                    CheckMandatoryResponsibility("2");
                }
                return false;
            }
            else if (relatedWrkItem) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step3';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 3 - Related work items");
                    $("#relatedRelationship").empty();
                    $("#relatedwiwsddl").empty();
                    $("#relatedRelationship").prepend(defaultOpt);
                    $("#relatedwiwsddl").prepend(defaultOpt);
                }
                return false;
            }
            else if (metadatagrps) {
                IsValid = CheckKendoGridInEdit();
                if (IsValid) {
                    tab = 'step4';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 4 - Metadata groups");
                }
                return false;
            }
            if (LinkTitle || UnLinkTitle || RefreshData) {
                if (productMaster) {
                    IsValid = CheckKendoGridInEdit();
                    if (IsValid) {
                        tab = 'step5';
                        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                        $("#displaytext").html("Step 5 - Product master");
                        $('.productMasterInfo').removeClass('hide');
                    }
                    return false;
                }
                else if (attachments) {
                    IsValid = CheckKendoGridInEdit();
                    if (IsValid) {
                        tab = 'step6';
                        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                        $("#displaytext").html("Step 6 - Work item attachments ");
                    }
                    return false;
                }
                else if (billingRates) {
                    tab = 'step7';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 7 - Billing rates ");
                    if ($(this).hasClass("LoadWIBillingRates")) {
                        GetWorkItemBillingRates();
                    }
                    var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
                    if (billingratestype === "Inherited") {
                        BindRelatedWorkItems();
                        GetTasksBillingrates();
                    }
                    BillingRatesValidations();
                    return false;
                }
            }
            else {
                if (attachments) {
                    IsValid = CheckKendoGridInEdit();
                    if (IsValid) {
                        tab = 'step5';
                        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                        $("#displaytext").html("Step 5 - Work item attachments ");
                    }
                    return false;
                }
                else if (billingRates) {
                    tab = 'step6';
                    $('.nav-tabs a[href="#' + tab + '"]').tab('show');
                    $("#displaytext").html("Step 6 - Billing rates ");
                    if ($(this).hasClass("LoadWIBillingRates")) {
                        GetWorkItemBillingRates();
                    }
                    var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
                    if (billingratestype === "Inherited") {
                        BindRelatedWorkItems();
                        GetTasksBillingrates();
                    }
                    BillingRatesValidations();
                    return false;
                }
            }
        }
        else if (workItemMode === "WorkflowDashboard") {
            var activeTabid;
            if ($(this).hasClass("Workspacetab")) {
                activeTabid = 'WorkspaceInfo';
                $('#WorkspaceList, #WorkspaceInfo').addClass('active');
                $('#WorkitemList, #WorkitemInfo').removeClass('active');
            }
            else if ($(this).hasClass("Workitemtab")) {
                activeTabid = 'WorkitemInfo';
                $('#WorkitemList, #WorkitemInfo').addClass('active');
                $('#WorkspaceList, #WorkspaceInfo').removeClass('active');
            }
        }
        else if (workItemMode === "WorkspaceInsSaveSuccess" || workItemMode === "WorkitemInsSaveSuccess") {
            var activeTabid;
            if ($(this).hasClass("Workspacetab")) {
                activeTabid = 'WorkspaceInfo';
                $('#WorkspaceList, #WorkspaceInfo').addClass('active');
                $('#WorkitemList, #WorkitemInfo').removeClass('active');
            }
            else if ($(this).hasClass("Workitemtab")) {
                activeTabid = 'WorkitemInfo';
                $('#WorkitemList, #WorkitemInfo').addClass('active');
                $('#WorkspaceList, #WorkspaceInfo').removeClass('active');
            }
        }
        else if (workItemMode === "ViewWorkItem") {
            if (IsLinkedToBookId) {
                $('#UnLinkProductMaster,#btnwiRefreshProductMaster').addClass('hide');
            }
            var activeTabid;
            if ($(this).hasClass("Resourceallocationtab")) {
                activeTabid = 'ResourceInfo';
                $('#ResourceallocationList, #ResourceInfo').addClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').removeClass('active');
                $('#KpiMetricsList, #KpiMetricsInfo').removeClass('active');
                $('#WorkflowList, #WorkflowInfo').removeClass('active');
                $('#MetadataList, #MetadataInfo').removeClass('active');
                TabInActiveforProductMaster();
            }
            else if ($(this).hasClass("Relatedworkitemstab")) {
                activeTabid = 'RelatedWorkitemsInfo';
                $('#ResourceallocationList, #ResourceInfo').removeClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').addClass('active');
                $('#KpiMetricsList, #KpiMetricsInfo').removeClass('active');
                $('#WorkflowList, #WorkflowInfo').removeClass('active');
                $('#MetadataList, #MetadataInfo').removeClass('active');
                TabInActiveforProductMaster();
            }
            else if ($(this).hasClass("Workflowtab")) {
                activeTabid = 'KpiMetricsInfo';
                $('#ResourceallocationList, #ResourceInfo').removeClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').removeClass('active');
                $('#KpiMetricsList, #KpiMetricsInfo').removeClass('active');
                $('#WorkflowList, #WorkflowInfo').addClass('active');
                $('#MetadataList, #MetadataInfo').removeClass('active');
                TabInActiveforProductMaster();
            }
            else if ($(this).hasClass("Metadatatab")) {
                activeTabid = 'MetadataInfo';
                $('#ResourceallocationList, #ResourceInfo').removeClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').removeClass('active');
                $('#KpiMetricsList, #KpiMetricsInfo').removeClass('active');
                $('#WorkflowList, #WorkflowInfo').removeClass('active');
                $('#MetadataList, #MetadataInfo').addClass('active');
                TabInActiveforProductMaster();
            }
            else if ($(this).hasClass("Productmastertab") && IsLinkedToBookId) {
                activeTabid = 'ProductMaster';
                $('#ResourceallocationList, #ResourceInfo').removeClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').removeClass('active');
                $('#KpiMetricsList, #KpiMetricsInfo').removeClass('active');
                $('#WorkflowList, #WorkflowInfo').removeClass('active');
                $('#MetadataList, #MetadataInfo').removeClass('active');
                $('#ProductMaster, #ProductMasterInfo').addClass('active');
            }
            else if ($(this).hasClass("KpiMetricstab")) {
                activeTabid = 'KpiMetricsInfo';
                $('#ResourceallocationList, #ResourceInfo').removeClass('active');
                $('#RelatedworkitemsList, #RelatedWorkitemsInfo').removeClass('active');
                $('#KpiMetricsList, #KpiMetricsInfo').addClass('active');
                $('#WorkflowList, #WorkflowInfo').removeClass('active');
                $('#MetadataList, #MetadataInfo').removeClass('active');
                TabInActiveforProductMaster();
            }
            localStorage.setItem("activeTabid", activeTabid);
        }
    });
    function TabInActiveforProductMaster() {
        if (IsLinkedToBookId) {
            $('#ProductMaster, #ProductMasterInfo').removeClass('active');
        }
    }
    function CheckKendoGridInEdit() {
        var IsValid = true;
        var grid = $("#WorkItem_BillingRates").closest(".k-grid");
        if (grid !== null) {
            editRow = grid.find(".k-grid-edit-row");
            if (editRow.length > 0) {
                message = Web_SaveCancelResponsibility;
                $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                $('.WIBillingRatesGridErrorMsg').html(message);
                window.scrollTo(0, 0);
                setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
                IsValid = false;
            }
        }
        return IsValid;
    }

    //Work item file attachments code
    $('.addAttachments').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (fileExtensionTypes !== null && fileExtensionTypes.length > 0) {
            for (i = 0; i < fileExtensionTypes.length; i++) {
                var extensionName = fileExtensionTypes[i].Name;
                fileExtensionTypesList.push(extensionName);
            }
        }
        progress("1");
        $.ajax('LoadWIFileInformation', {
            type: 'POST',
            dataType: 'html',
            success: function (data, status, xhr) {
                progress("2");
                $('#fileAttachment_div').show();
                $('#fileAttachment_div').removeClass('hide');
                $('#fileAttachment_div').html('');
                $('#fileAttachment_div').html(data);
                btnFileSaveDisable();
                $('#attachmentName, .file, .link').attr("disabled", true);
                $("#attachmentName, .file, .link").css('cursor', 'not-allowed');
                $('#fileEditButtonsDiv').addClass('hide');
                $('#fileCreateButtonsDiv').removeClass('hide');
            }
        });
    });
    $(document).on('change', '#WorkItemFileUpload', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var size, SelectedAttachmentNames, ext;
        var files_selected = [];
        var labelName = "File";
        var CurrentId = $(this).attr('id');
        var selectedFiles = $('#WorkItemFileUpload').prop("files");
        var allowedmaxlength = $('#attachmentName').data('maxlength');
        if (maxFileCount === "0" && selectedFiles.length > 0) {
            ValidateFileCount();
        }
        else if (maxFileCount !== "0") {
            if (selectedFiles.length > maxFileCount) {
                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_MaxFileCount.replace("{0}", maxFileCount) + '</span>');
                btnFileSaveDisable();
            }
            else {
                ValidateFileCount();
            }
        }
        else {
            ValidateFileCount();
        }

    });

    function ValidateFileCount() {
        var size, SelectedAttachmentNames, ext;
        var files_selected = [];
        var labelName = "File";
        var CurrentId = $("#WorkItemFileUpload").attr('id');
        var selectedFiles = $('#WorkItemFileUpload').prop("files");
        var allowedmaxlength = $('#attachmentName').data('maxlength');
        var selected_Files = [];
        if (selectedFiles.length > 0) {
            for (var i = 0; i < selectedFiles.length; i++) {
                files_selected.push(selectedFiles[i].name);
                ext = selectedFiles[i].name.split('.').pop().toLowerCase();
                size = selectedFiles[i].size;
                //Validating file name length
                if (selectedFiles[i].name.length > allowedmaxlength) {
                    $('#attachmentName').val(selectedFiles[i].name);
                    $('.errmsg' + 'attachmentName').remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#attachmentName').after('<span class="text-danger ' + varErrorClassName + '">' + Web_FileNameExistsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                    btnFileSaveDisable();
                    break;
                }
                //Validating file extension
                else if ($.inArray(ext, fileExtensionTypesList) === -1) {
                    selected_Files.push(selectedFiles[i].name);
                    //$('.errmsg' + CurrentId).remove();
                    //varErrorClassName = 'errmsg' + CurrentId;
                    //$('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">Invalid file extension.</span>');
                    //btnFileSaveDisable();
                    //break;
                }
                //Restrict for 1gb file
                //else if (size > 1073741824) {
                //    $('.errmsg' + CurrentId).remove();
                //    varErrorClassName = 'errmsg' + CurrentId;
                //    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_FileSizeValidateMsg.replace("{0}", selectedFiles[i].name) + '</span>');
                //    btnFileSaveDisable();
                //    break;
                //}
                else {
                    $('.errmsg' + CurrentId).remove();
                    $('.errmsg' + 'attachmentName').remove();
                    SelectedAttachmentNames = files_selected.toString();
                    $('#attachmentName').val(SelectedAttachmentNames);
                    var selectedAttachmentType = $("#ddlAttachmentType option:selected").index();
                    if (selectedAttachmentType >= 1) {
                        btnFileSaveEnable();
                    }
                }
            }
            if (selected_Files !== null && selected_Files.length > 0) {
                if (selected_Files.length > 1) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_InvalidMultipleFilesExtensions.replace("{0}", selected_Files) + '</span>');
                    btnFileSaveDisable();
                }
                else {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_InvalidFileExtensions.replace("{0}", selected_Files) + '</span>');
                    btnFileSaveDisable();
                }
            }
        }
        else {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            btnFileSaveDisable();
        }
    }


    $(document).on('change', '#ddlAttachmentType', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var selectedAttachmentType = $("#ddlAttachmentType option:selected").index();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        //var value = $("#" + CurrentId).val();
        //var filename = $('#attachmentName').val();
        //var Isavilable;
        //if (filename !== "") {
        //    Isavilable = FileNameDuplicatecheck(filename, $("#txtWIInstanceID").val(), $("#ddlAttachmentType option:selected").text(), $("input:radio[name='IsAttachementFileOrURL']:checked").val(), $("#hidWorkitemInstAttchmentID").val());
        //}
        $('.errmsgattachmentName').remove();
        $('#attachmentFileUrlPath').val('');

        if (selectedAttachmentType <= 0) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            btnFileSaveDisable();
        }
        //else if (Isavilable !== undefined) {
        //    if (Isavilable.isExists) {
        //        $('.errmsg' + CurrentId).remove();
        //        varErrorClassName = 'errmsg' + CurrentId;
        //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", labelName) + '</span>');
        //        btnFileSaveDisable();
        //        return false;
        //    }
        //}
        else {
            $('.errmsg' + CurrentId).remove();
            //Getting the File/Link type attachment details
            var attachmentType = GetAttachmentType($("#ddlAttachmentType option:selected").val())
            if (attachmentType === "File") {
                $(".file").prop('checked', true);
                $(".link").prop('checked', false);
                $('.link, .file').attr("disabled", false);
                $('.link, .file').css("cursor", '');
                $("#File_Div").removeClass('hide');
                $("#Link_Div").addClass('hide');
                $("#attachmentName, #WorkItemFileUpload").val('');
                $("#attachmentName").attr("disabled", true);
                $('#attachmentName').css("cursor", 'not-allowed');
                $("#attachmentName, #attachmentFileUrlPath").removeClass('required');
                btnFileSaveDisable();
            }
            else if (attachmentType === "Link") {
                $(".file").prop('checked', false);
                $(".link").prop('checked', true);
                $('.link, .file').attr("disabled", true);
                $('.link, .file').css("cursor", 'not-allowed');
                $("#File_Div").addClass('hide');
                $("#Link_Div").removeClass('hide');
                $("#attachmentName, #WorkItemFileUpload").val('');
                $("#attachmentName").attr("disabled", false);
                $('#attachmentName').css("cursor", 'pointer');
                $('#attachmentName').removeClass('input-disable');
                $("#attachmentName, #attachmentFileUrlPath").addClass('required');
                btnFileSaveDisable();
            }
            var attachmentName = $("#attachmentName").val();
            if (attachmentName !== "" || ($("#attachmentFileUrlPath").hasClass('required') && $("#attachmentFileUrlPath").val() !== "")) {
                btnFileSaveEnable();
            }
        }
    });
    $(document).on('change', '.radioFileTypeWI', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('.errmsgattachmentName').remove();
        $('.errmsgattachmentFileUrlPath').remove();
        if (this.value == 'File') {
            $("#File_Div").removeClass('hide');
            $("#Link_Div").addClass('hide');
            $("#attachmentName, #WorkItemFileUpload").val('');
            $("#attachmentName").attr("disabled", true);
            $('#attachmentName').css("cursor", 'not-allowed');
            $("#attachmentName, #attachmentFileUrlPath").removeClass('required');
            btnFileSaveDisable();
        }
        else if (this.value == 'Link') {
            $("#File_Div").addClass('hide');
            $("#Link_Div").removeClass('hide');
            $("#attachmentName, #WorkItemFileUpload").val('');
            $('#attachmentFileUrlPath').val('');
            $("#attachmentName").attr("disabled", false);
            $('#attachmentName').css("cursor", 'pointer');
            $('#attachmentName').removeClass('input-disable');
            $("#attachmentName, #attachmentFileUrlPath").addClass('required');
            btnFileSaveDisable();
        }
    });

    $(document).on('focusout', '#attachmentName', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val();
        var fileNameRegex = /^(?=[\S])[^\/:*?"<>|]+$/;
        if ($(this).hasClass('required')) {
            if ($('#' + CurrentId).val() === "") {
                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
                btnFileSaveDisable();
            }
            else {
                var Isavilable = FileNameDuplicatecheck(value, $("#txtWIInstanceID").val(), $("#ddlAttachmentType option:selected").text(), $("input:radio[name='IsAttachementFileOrURL']:checked").val(), $("#hidWorkitemInstAttchmentID").val());
                if (Isavilable.isExists) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", value) + '</span>');
                    btnFileSaveDisable();
                    return false;
                } else {
                    if (value.length > allowedmaxlength) {
                        $('.errmsg' + CurrentId).remove();
                        varErrorClassName = 'errmsg' + CurrentId;
                        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                        btnFileSaveDisable();
                    }
                    else if (!fileNameRegex.test($("#attachmentName").val())) {
                        $('.errmsg' + CurrentId).remove();
                        varErrorClassName = 'errmsg' + CurrentId;
                        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_FilenameContainInvalidCharacters.replace("{0}", labelName) + '</span>');
                        btnFileSaveDisable();
                    }
                    else {
                        $('.errmsg' + CurrentId).remove();
                        var selectedAttachmentType = $("#ddlAttachmentType option:selected").index();
                        if (selectedAttachmentType >= 1 && $("#attachmentFileUrlPath").val() !== "") {
                            btnFileSaveEnable();
                        }
                        else {
                            btnFileSaveDisable();
                        }
                    }
                }
            }
        }
    });
    $(document).on('focusout', '#attachmentFileUrlPath', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val();
        //var reg = /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/;
        var reg = /^(http|https)?:\/\/[a-zA-Z0-9-\.]+\.[a-z]{2,4}/;
        if ($(this).hasClass('required')) {
            if ($('#' + CurrentId).val() === "") {
                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
                btnFileSaveDisable();
            }
            else {
                if (value.length > allowedmaxlength) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                    btnFileSaveDisable();
                }
                if (reg.test(value)) {
                    var domainName = $('<a>').prop('href', value).prop('hostname');
                    if (domainName === "youtube.com") {
                        var str = value;
                        var res = str.split("//");
                        domainName = res[1];
                    }
                    var isValidDomain = CheckDomainName(domainName);
                    if (!isValidDomain) {
                        $('.errmsg' + CurrentId).remove();
                        varErrorClassName = 'errmsg' + CurrentId;
                        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_InvalidDomainName + ' ');
                        btnFileSaveDisable();
                    }
                    else {
                        $('.errmsg' + CurrentId).remove();
                        var IsErrorMsgExists = $(".errmsgattachmentName").is(':visible');
                        var selectedAttachmentType = $("#ddlAttachmentType option:selected").index();
                        if (selectedAttachmentType >= 1 && $("#attachmentName").val() !== "" && !IsErrorMsgExists) {
                            btnFileSaveEnable();
                        }
                        else {
                            btnFileSaveDisable();
                        }
                    }
                }
                else {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_ValidURL + ' ');
                    btnFileSaveDisable();
                }
            }
        }
    });
    $(document).on('focusout', '#addTags', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (value != null && value != "") {
            if (value.length > allowedmaxlength) {
                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                btnFileSaveDisable();
            }
            else {
                var Isavilable = CheckSerachTagNameAvailability(value);
                if (Isavilable) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AlreadyExists.replace("{0}", value + " " + labelName) + '</span>');
                    btnFileSaveDisable();
                    return false;
                }
                $('.errmsg' + CurrentId).remove();
                var attachmentName = $("#attachmentName").val();
                var selectedAttachmentType = $("#ddlAttachmentType option:selected").index();
                var IsErrorMsgExists = $(".errmsgattachmentName").is(':visible');
                var isFileOrLink = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
                if (isFileOrLink === "File") {
                    if (selectedAttachmentType >= 1 && attachmentName !== "" && !IsErrorMsgExists) {
                        btnFileSaveEnable();
                    }
                    else {
                        btnFileSaveDisable();
                    }
                }
                else {
                    if ($("#attachmentFileUrlPath").hasClass('required') && $("#attachmentFileUrlPath").val() === "") {
                        btnFileSaveDisable();
                    }
                    else {
                        if ($(".errmsgattachmentFileUrlPath").is(':visible')) {
                            btnFileSaveDisable();
                        }
                        else {
                            btnFileSaveEnable();
                        }
                    }
                }
            }
        }
    });
    //$(document).on('paste', '#addTags', function (event) {
    //    if (event.originalEvent.clipboardData.getData('Text').match(/[^a-zA-Z0-9- ]/)) {
    //        event.preventDefault();
    //        var labelName = $(this).data('validatelabel');
    //        var CurrentId = $(this).attr('id');
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //        event.preventDefault();
    //    }
    //});
    $(document).on('paste', '#attachmentName', function (event) {
        if (!event.originalEvent.clipboardData.getData('Text').match(/^(?=[\S])[^\\ \/ : * ? " < > | ]+$/)) {
            event.preventDefault();
            var labelName = $(this).data('validatelabel');
            var CurrentId = $(this).attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_FilenameContainInvalidCharacters.replace("{0}", labelName) + '</span>');
            event.preventDefault();
        }
    });
    //$(document).on('keypress', '.CharacterValidation', function (e) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var keyCode = e.which;
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var value = $("#" + CurrentId).val().trim();
    //    if ((keyCode < 48 || keyCode > 57)
    //        && (keyCode < 65 || keyCode > 90)
    //        && (keyCode < 97 || keyCode > 122)
    //        && (keyCode !== 0)
    //        && (keyCode !== 8)
    //        && (keyCode !== 32)
    //        && (keyCode !== 45)) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else if (value.length > allowedmaxlength - 1 && keyCode !== 8 && keyCode !== 0) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else {

    //        $('.errmsg' + CurrentId).remove();
    //    }
    //});
    $(document).on('keypress', '#attachmentName', function (e) {
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var keyCode = e.which;
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (keyCode === 60 || keyCode === 62 || keyCode === 124 || keyCode === 92 || keyCode === 47 || keyCode === 42 || keyCode === 58 || keyCode === 34 || keyCode === 63) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_FilenameContainInvalidCharacters.replace("{0}", labelName) + '</span>');
            e.preventDefault();
            return false;
        }
        else if (value.length > allowedmaxlength - 1 && keyCode !== 8 && keyCode !== 0) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
            e.preventDefault();
            return false;
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $(document).on('click', '#btnwiCancelFileAttachment', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#fileAttachment_div').addClass('hide');

        $(".DeleteWIFile").prop("disabled", false);
        $(".DeleteWIFile").css("cursor", "pointer");
    });

    var sasKey;
    var fileCount;
    var fileIncr = 0;
    $(document).on('click', '#btnwiAddFileAttachment', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $('#btnwiAddFileAttachment').attr("disabled", true);
        $('#btnwiAddFileAttachment').addClass("Button-disable");
        $('#btnwiAddFileAttachment').removeClass("Button");
        $.ajax({
            url: WebURL + "/WorkitemEnduser/GetSASToken",
            type: 'GET',
            async: false,
            success: function (res) {
                sasKey = (res.charAt(0) == "?") ? res.substring(1) : res;
            }
        });

        if ($("input:radio[name='IsAttachementFileOrURL']:checked").val() === "Link") {
            if (workitemEndUser != null || workitemEndUser != undefined) {
                if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                    workitemEndUser = JSON.parse(workitemEndUser);
                }
            }
            if (workitemEndUser.WorkItemInstance.WorkItemFileManagement === null || workitemEndUser.WorkItemInstance.WorkItemFileManagement === undefined) {
                workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
            }
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceAttachmentID = $("#hidWorkitemInstAttchmentID").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlAttachmentType option:selected").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlAttachmentType option:selected").text();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentName = $("#attachmentName").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.FilePath = $("#attachmentFileUrlPath").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemID = $("#txtWIInstanceID").val();

            var selectedSearchtags = $("#drpSearchTags").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.NewSearchTag = $("#addTags").val().trim();

            fileUploadtoDB();
        }
        else {
            /* Start of duplicate file upload check */
            var Isavilable = FileNameDuplicatecheck($("#attachmentName").val(), $("#txtWIInstanceID").val(), $("#ddlAttachmentType option:selected").text(), $("input:radio[name='IsAttachementFileOrURL']:checked").val(), 0);
            if (Isavilable.isExists) {
                ConformDuplicateFilenamePopup(Isavilable.fileNames);
                $("#btnDuplicateFileNameYes").on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $('#DuplicateFileNamePopup').modal('hide');
                    //fileAttachment();
                    progress("1");
                    processFiles();

                    function recallUploadtoDB() {
                        setTimeout(function () {
                            if (fileCount <= 0) {
                                fileUploadtoDB();
                            }
                            else {
                                recallUploadtoDB();
                            }
                        }, 200);
                    }
                    recallUploadtoDB();
                });

                $("#btnDuplicateFileNameNo").on('click', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $('#DuplicateFileNamePopup').modal('hide');
                    $('#fileAttachment_div input').val('');
                    $('#fileAttachment_div select').val('');
                    var multiSelect = $('#drpSearchTags').data("kendoMultiSelect");
                    multiSelect.value([]);
                    $('#fileAttachment_div').addClass('hide');
                    $("input:radio[name='WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL']:checked").val(workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL);
                });
            }
            else {
                //fileAttachment();
                progress("1");
                processFiles();

                function recallUploadtoDB() {
                    setTimeout(function () {
                        if (fileCount <= 0) {
                            fileUploadtoDB();
                        }
                        else {
                            recallUploadtoDB();
                        }
                    }, 200);
                }
                recallUploadtoDB();

            }
            /* End of duplicate file upload check */
        }

    });

    function fileUploadtoDB() {
        var widata;
        widata = new FormData();

        var ModelData = JSON.stringify(workitemEndUser);
        widata.append('ModelData', ModelData);
        this.workitemEndUser = ModelData;

        progress("1");
        $.ajax('SaveWIFileAttachments', {
            type: 'POST',
            data: widata,
            async: false,
            dataType: 'json',
            processData: false,
            contentType: false, /*'application/json',*/
            success: function (data, status, xhr) {
                progress("2");
                $('#btnwiAddFileAttachment').attr("disabled", false);
                $("#viewCurrentAttachments").prop('checked', true);
                $("#viewAllAttachments").prop('checked', false);
                message = Web_WorkItemInstanceAttachmentUploadSuccess.replace("{0}", $("#attachmentName").val());
                //var uploadedFileList = [];
                //if (data.WorkItemInstance.WIAzureUploadedFileManagementList !== null && data.WorkItemInstance.WIAzureUploadedFileManagementList.length > 0) {
                //    for (var i = 0; i < data.WorkItemInstance.WIAzureUploadedFileManagementList.length; i++) {
                //        uploadedFileList.push(data.WorkItemInstance.WIAzureUploadedFileManagementList[i].SuccessFileNames);
                //    }
                //}
                //message = Web_WorkItemInstanceAttachmentUploadSuccess.replace("{0}", uploadedFileList);
                $('#WIEditSuccessMsg').removeClass('hide');
                $('#WIEditSuccessMsg').html(message);
                $('#WIEditSuccessMsg').addClass('txtcolourforestgreen');
                setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);

                //var failedFileList = [];
                //if (data.WorkItemInstance.WIAzureFailedFileManagementList !== null && data.WorkItemInstance.WIAzureFailedFileManagementList.length > 0) {
                //    for (var j = 0; j < data.WorkItemInstance.WIAzureFailedFileManagementList.length; j++) {
                //        failedFileList.push(data.WorkItemInstance.WIAzureFailedFileManagementList[j].FailedFileNames);
                //    }
                //}
                //var errorMessage = Web_WorkitemAzureUploadFailed.replace("{0}", failedFileList);
                //if (failedFileList !== null && failedFileList.length > 0) {
                //    $('#WIEditFailureMsg').removeClass('hide');
                //    $('#WIEditFailureMsg').html(errorMessage);
                //    $('#WIEditFailureMsg').addClass('text-danger');
                //    setTimeout(function () { $("#WIEditFailureMsg").html(''); }, Web_MsgTimeOutValue);
                //}

                $('#fileAttachment_div').addClass('hide');
                var FilesList = data.WorkItemInstance.WorkItemFileManagementList;
                if (workitemEndUser != null || workitemEndUser != undefined) {
                    if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                        workitemEndUser = JSON.parse(workitemEndUser);
                    }
                }
                if (workitemEndUser.WorkItemInstance.WorkItemFileManagementList === null || workitemEndUser.WorkItemInstance.WorkItemFileManagementList === undefined) {
                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = [];
                }
                workitemEndUser.WorkItemInstance.WorkItemFileManagementList = data.WorkItemInstance.AllVersionsWorkItemFileManagementList;
                var Mode = data.WorkItemInstance.CurrentMode;
                loadFileAttachmentsGrid(FilesList, Mode);
            }
        });
    }

    async function processFiles() {
        fileIncr = 0;
        var selectedFiles = $('#WorkItemFileUpload').prop("files");
        fileCount = selectedFiles.length;

        for (var i = 0; i < selectedFiles.length; i++) {
            var proghtml = "<div id='fileName" + i + "' class='col-md-12 text-center'></div><div class='progress col-md-12'><div id='fileprogress" + i + "' class='progress-bar progress-bar-striped' role='progressbar' aria-valuenow=0 aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
            $("#progbar").append(proghtml);
            //console.log("File Mime Type..." + selectedFiles[i].type);
            await fileAttachment(selectedFiles[i]);
        }
    }

    async function fileAttachment(file1) {
        var file = file1;
        var filename = file.name;
        console.log("File Mime Type..." + file1.type);
        sessionStorage.clear();
        if (workitemEndUser != null || workitemEndUser != undefined) {
            if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                workitemEndUser = JSON.parse(workitemEndUser);
            }
        }
        if (workitemEndUser.WorkItemInstance.WorkItemFileManagement === null || workitemEndUser.WorkItemInstance.WorkItemFileManagement === undefined) {
            workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
        }
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceAttachmentID = $("#hidWorkitemInstAttchmentID").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlAttachmentType option:selected").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlAttachmentType option:selected").text();
        //workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentName = filename//$("#attachmentName").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.FilePath = $("#attachmentFileUrlPath").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemID = $("#txtWIInstanceID").val();

        var selectedSearchtags = $("#drpSearchTags").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.NewSearchTag = $("#addTags").val().trim();

        /* Start of Azure */
        var blobStorageUri = azureUri;
        /* End of Azure */

        //var containerName = await SetContainerName($("#txtWIInstanceID").val());
        var containerName = $("#txtWIInstanceID").val().trim();
        if (containerName.length < 3)
            containerName = ('000' + containerName).slice(-3);

        //var selectedFiles = $('#WorkItemFileUpload').prop("files");

        /* Start of capturing file attachment details and append to list */
        var wiFileMgmt = workitemEndUser.WorkItemInstance.WorkItemFileManagement;
        //var uploadStatus = workitemEndUser.WorkItemInstance.FileManagementUploadState;

        /* End of capturing file attachment details and append to list */
        var blobService = AzureStorage.createBlobServiceWithSas(blobStorageUri, sasKey).withFilter(new AzureStorage.ExponentialRetryPolicyFilter());

        var wiFileMgmtList = workitemEndUser.WorkItemInstance.WorkItemFileManagementList;
        var wiFileUploadList = workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList;

        if (!blobService)
            return;

        //var file = selectedFiles[i];
        var sizeInBytes = file.size;
        var convertToKiloBytes = 1024;
        var checkMD5 = false;
        var fileStream = new FileStream(file);

        // Make a smaller block size when uploading small blobs
        var blockSize = sizeInBytes > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        var options = {
            storeBlobContentMD5: checkMD5,
            blockSize: blockSize,
            contentSettings: {
                contentType: file.type
            }
        };
        blobService.singleBlobPutThresholdInBytes = blockSize;

        var directory = $("#ddlAttachmentType option:selected").val();
        var finishedOrError = false;
        var snapCreatefinishedOrError = false;
        var sasSnapshotUrl;

        var containerOrError = false;
        var blobExistOrError = false;
        var snapshotExists = false;
        var blobPropExistOrError = false;
        var blobSnapPropExistOrError = false;

        await blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, function (error, result, response) {
            containerOrError = true;
            if (!error && result != null) {
                //console.log('Container exists or not...');
                containerProgress(containerOrError, blobExistsProgress)
            }
        });

        function containerProgress(containerOrError, blobExistsProgress) {
            var isBlobExist;

            blobService.doesBlobExist(containerName, directory + "/" + filename, function (error, result, response) {
                blobExistOrError = true;
                if (error) {
                    console.log('Blob exist error...');
                }
                else if (result != null) {
                    isBlobExist = result.exists;
                    blobExistsProgress(containerOrError, isBlobExist);
                }
            });
        }

        function blobExistsProgress(containerOrError, isBlobExist) {
            if (containerOrError && isBlobExist) {
                blobService.createBlobSnapshot(containerName, directory + "/" + filename, function (error, result, response) {
                    snapshotExists = true;
                    if (error) {
                        console.log('Blob snapshot creation error...');
                    } else if (containerOrError && blobExistOrError && result != null) {
                        sasSnapshotUrl = blobService.getUrl(containerName.toString(), directory + "/" + filename, null, true, result);
                        wiFileMgmt.AttachmentName = filename
                        wiFileMgmt.DBOperation = "Snapshot";
                        wiFileMgmt.size = sizeInBytes / convertToKiloBytes;
                        wiFileMgmt.AttachmentURL = decodeURIComponent(sasSnapshotUrl);
                        wiFileMgmtList.push(Object.assign({}, wiFileMgmt));
                        sessionStorage.setItem('wiFileMgmtList', JSON.stringify(wiFileMgmtList));
                        snapshotProgress();
                    }
                });
            }
            else if (containerOrError && !isBlobExist) {
                var speedSummary = blobService.createBlockBlobFromStream(containerName, directory + "/" + filename, fileStream, sizeInBytes, options, function (error, result, response) {
                    finishedOrError = true;
                    if (error) {
                        console.log('Upload failed, open brower console for more detailed info.');
                        wiFileUploadList = JSON.parse(sessionStorage.getItem('wiFileUploadList'));
                        if (wiFileUploadList != undefined && wiFileUploadList != null) {
                            uploadStatus.FailedFileNames = filename;
                            wiFileUploadList.push(uploadStatus);
                            sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList))
                            workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                        }
                        else {
                            var wiFileUploadList = workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList;

                            uploadStatus.FailedFileNames = filename;
                            wiFileUploadList.push(uploadStatus);
                            sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList));
                            workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                        }
                        displayProcess(0, fileIncr, filename);
                        fileCount--;
                        fileIncr++;
                        return true;
                    }
                    else if (containerOrError && result != null) {
                        displayProcess(100, fileIncr, filename, function () {
                            // Prevent alert from stopping UI progress update
                            console.log('Upload successfully...!');
                        });
                        var sasUrl = blobService.getUrl(containerName, directory + "/" + filename);
                        blobService.getBlobProperties(containerName, directory + "/" + filename, function (error, result, response) {
                            blobPropExistOrError = true;
                            if (!error) {
                                filename = result.name.substring(result.name.indexOf("/") + 1, result.name.length);
                                wiFileMgmt.AttachmentURL = decodeURIComponent(sasUrl);
                                //wiFileMgmt.Version = wiFileMgmt.Version + 1;
                                wiFileUploadList = JSON.parse(sessionStorage.getItem('wiFileUploadList'));
                                if (wiFileUploadList != undefined && wiFileUploadList != null) {
                                    uploadStatus.SuccessFileNames = filename;
                                    wiFileUploadList.push(uploadStatus);
                                    sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList))
                                    workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                                }
                                else {
                                    var wiFileUploadList = workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList;

                                    //uploadStatus.SuccessFileNames = filename;
                                    //wiFileUploadList.push(uploadStatus);
                                    //sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList));
                                    //workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                                }

                                wiFileMgmtList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'));
                                if (wiFileMgmtList != undefined && wiFileMgmtList != null) {
                                    wiFileMgmt.AttachmentName = filename;
                                    wiFileMgmt.DBOperation = "Insert";
                                    wiFileMgmt.size = sizeInBytes / convertToKiloBytes;
                                    wiFileMgmtList.push(wiFileMgmt);
                                    sessionStorage.setItem('wiFileMgmtList', JSON.stringify(wiFileMgmtList));
                                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'))
                                }
                                else {
                                    var wiFileMgmtList = workitemEndUser.WorkItemInstance.WorkItemFileManagementList;
                                    wiFileMgmt.AttachmentName = filename;
                                    wiFileMgmt.DBOperation = "Insert";
                                    wiFileMgmt.size = sizeInBytes / convertToKiloBytes;
                                    wiFileMgmtList.push(wiFileMgmt);
                                    sessionStorage.setItem('wiFileMgmtList', JSON.stringify(wiFileMgmtList));
                                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'))
                                }
                                //console.log('Upload successfully...! ');        // + JSON.stringify(workitemEndUser.WorkItemInstance.WorkItemFileManagementList)
                                fileCount--;
                                fileIncr++;
                            }
                        });
                    }
                });

                function refreshProgress() {
                    setTimeout(function () {
                        if (!finishedOrError && (containerOrError && blobExistOrError)) {
                            //speedSummary.on('progress', function () {
                            var process = speedSummary.getCompletePercent();
                            displayProcess(process, fileIncr, filename, function () {
                                // Prevent alert from stopping UI progress update
                                console.log('In Progress...!');
                            });
                            //});
                            refreshProgress();
                            console.log('file progress percentage ...' + process);
                        }
                    }, 1000);
                }
                refreshProgress();
            }
        }

        function snapshotProgress() {
            if (!snapshotExists && (containerOrError && blobExistOrError)) {
                snapshotProgress();
            }
            else {
                var speedSummary = blobService.createBlockBlobFromStream(containerName, directory + "/" + filename, fileStream, sizeInBytes, options, function (error, result, response) {
                    snapCreatefinishedOrError = true;

                    if (error) {
                        console.log('Upload failed, open brower console for more detailed info.');
                        wiFileUploadList = JSON.parse(sessionStorage.getItem('wiFileUploadList'));
                        if (wiFileUploadList != undefined && wiFileUploadList != null) {
                            uploadStatus.FailedFileNames = filename;
                            wiFileUploadList.push(uploadStatus);
                            sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList))
                            workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                        }
                        else {
                            var wiFileUploadList = workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList;

                            uploadStatus.FailedFileNames = filename;
                            wiFileUploadList.push(uploadStatus);
                            sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList));
                            workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                        }
                        displayProcess(0, fileIncr, filename);
                        fileCount--;
                        fileIncr++;
                        return true;
                    }
                    else if (containerOrError && result != null) {
                        displayProcess(100, fileIncr, filename, function () {
                            // Prevent alert from stopping UI progress update
                            console.log('Upload successfully...!');
                        });
                        var sasUrl = blobService.getUrl(containerName, directory + "/" + filename);
                        blobService.getBlobProperties(containerName, directory + "/" + filename, function (error, result, response) {
                            blobPropExistOrError = true;
                            if (!error) {
                                filename = result.name.substring(result.name.indexOf("/") + 1, result.name.length);
                                wiFileMgmt.AttachmentURL = decodeURIComponent(sasUrl);
                                //wiFileMgmt.Version = wiFileMgmt.Version + 1;
                                wiFileUploadList = JSON.parse(sessionStorage.getItem('wiFileUploadList'));
                                if (wiFileUploadList != undefined && wiFileUploadList != null) {
                                    uploadStatus.SuccessFileNames = filename;
                                    wiFileUploadList.push(uploadStatus);
                                    sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList))
                                    workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                                }
                                else {
                                    var wiFileUploadList = workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList;

                                    //uploadStatus.SuccessFileNames = filename;
                                    //wiFileUploadList.push(uploadStatus);
                                    //sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList));
                                    //workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'))
                                }

                                wiFileMgmtList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'));
                                if (wiFileMgmtList != undefined && wiFileMgmtList != null) {
                                    wiFileMgmt.AttachmentName = filename;
                                    wiFileMgmt.DBOperation = "Insert";
                                    wiFileMgmt.size = sizeInBytes / convertToKiloBytes;
                                    wiFileMgmtList.push(wiFileMgmt);
                                    sessionStorage.setItem('wiFileMgmtList', JSON.stringify(wiFileMgmtList));
                                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'))
                                }
                                else {
                                    var wiFileMgmtList = workitemEndUser.WorkItemInstance.WorkItemFileManagementList;
                                    wiFileMgmt.AttachmentName = filename;
                                    wiFileMgmt.DBOperation = "Insert";
                                    wiFileMgmt.size = sizeInBytes / convertToKiloBytes;
                                    wiFileMgmtList.push(wiFileMgmt);
                                    sessionStorage.setItem('wiFileMgmtList', JSON.stringify(wiFileMgmtList));
                                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'))
                                }
                                //console.log('Upload successfully...! ');        // + JSON.stringify(workitemEndUser.WorkItemInstance.WorkItemFileManagementList)
                                fileCount--;
                                fileIncr++;
                            }
                        });
                    }
                });
                refreshProgress();
                function refreshProgress() {
                    setTimeout(function () {
                        if (!snapCreatefinishedOrError && (containerOrError && blobExistOrError)) {
                            //speedSummary.on('progress', function () {
                            var process = speedSummary.getCompletePercent();
                            displayProcess(process, fileIncr, filename, function () {
                                // Prevent alert from stopping UI progress update
                                console.log('In Progress...!');
                            });
                            //});
                            refreshProgress();
                            console.log('snap file progress percentage ...' + process);
                        }
                    }, 500);
                }

            }
        }
    }

    /*  Start of client side slice and stream for upload     */
    function displayProcess(process, fCnt, fName) {
        $("#fileprogress" + fCnt).css("width", process + '%');
        $("#fileprogress" + fCnt).attr("aria-valuenow", process + '%');
        $("#fileprogress" + fCnt).text(process + "%");
        $("#fileName" + fCnt).text(fName);
    }
    /*  End of client side slice and stream for upload     */

    $(document).on('click', '#btnwiUpdateFileAttachment', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (workitemEndUser.WorkItemInstance.WorkItemFileManagement === null || typeof workitemEndUser.WorkItemInstance.WorkItemFileManagement === 'undefined') {
            workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
        }
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceAttachmentID = $("#hidWorkitemInstAttchmentID").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlAttachmentType option:selected").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlAttachmentType option:selected").text();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentName = $("#attachmentName").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.FilePath = $("#attachmentFileUrlPath").val();
        var selectedSearchtags = $("#drpSearchTags").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.NewSearchTag = $("#addTags").val().trim();
        var selectedFiles = $('#WorkItemFileUpload').prop("files");
        var data;
        data = new FormData();
        for (var i = 0; i < selectedFiles.length; i++) {
            data.append('files', selectedFiles[i]);
        }
        var ModelData = JSON.stringify(workitemEndUser);
        data.append('ModelData', ModelData);
        this.workitemEndUser = ModelData;
        //var data = JSON.stringify(workitemEndUser);
        progress("1");
        $.ajax('UpdateWIFileAttachments', {
            type: 'POST',
            data: data,
            dataType: 'html',
            //async: false,
            processData: false,
            contentType: false,
            //contentType: 'application/json',
            success: function (data, status, xhr) {
                progress("2");
                message = Web_WorkItemInstanceAttachmentUpdateSuccess.replace("{0}", $("#attachmentName").val());
                $('#WIEditSuccessMsg').removeClass('hide');
                $('#WIEditSuccessMsg').html(message);
                $('#WIEditSuccessMsg').addClass('txtcolourforestgreen');
                setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
                $('.attachmentGrid').html('');
                $('.attachmentGrid').html(data);
                $('#fileAttachment_div').addClass('hide');
            }
        });
    });
    $('.addExistingAttachments').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        progress("1");
        $.ajax('LoadAttachmentSearchInformation', {
            type: 'POST',
            dataType: 'html',
            success: function (data, status, xhr) {
                progress("2");
                $('#wiAllAttachmentsPoup').modal('show');
                $('#wiAllAttachments').html('');
                $('#wiAllAttachments').html(data);
                $('#btnWIAllAttachSave, #btnSearchWIAttachments, #btnWIAllAttachSaveInCreateWI').attr("disabled", true);
                $("#btnWIAllAttachSave, #btnSearchWIAttachments, #btnWIAllAttachSaveInCreateWI").css('cursor', 'not-allowed');
                $("#WIAllAttachments-select-all").prop('checked', false);
                $("#AddFilesMessageDiv").html('');
            }
        });
    });
    $(document).on('change', '#ddlSearchAttachmentType', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var selectedAttachmentType = $("#ddlSearchAttachmentType option:selected").index();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var value = $("#" + CurrentId).val();
        if (selectedAttachmentType <= 0) {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            $('#btnSearchWIAttachments').attr("disabled", true);
            $("#btnSearchWIAttachments").css('cursor', 'not-allowed');
            $("#btnSearchWIAttachments").addClass('Button-disable');
            $("#btnSearchWIAttachments").removeClass('Button');

        }
        else {
            $('.errmsg' + CurrentId).remove();
            $('#btnSearchWIAttachments').attr("disabled", false);
            $("#btnSearchWIAttachments").css('cursor', 'default');
            $("#btnSearchWIAttachments").addClass('Button');
            $("#btnSearchWIAttachments").removeClass('Button-disable');
        }
    });
    $(document).on('click', '#btnSearchWIAttachments', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').addClass('Button-disable');
        $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').removeClass('Button');
        $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').attr("disabled", true);
        $("#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI").css('cursor', 'not-allowed');
        if (workitemEndUser.WorkItemInstance.WorkItemFileManagement === null || typeof workitemEndUser.WorkItemInstance.WorkItemFileManagement === 'undefined') {
            workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
        }
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlSearchAttachmentType option:selected").val();
        //workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlSearchAttachmentType option:selected").text();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentName = $("#searchAttachmentName").val().trim();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceName = $("#searchWorkitemName").val().trim();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemID = $("#WorkitemInstanceID").val();
        var selectedSearchtags = $("#drpAllSearchTags").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
        var AllFilesList;
        progress("1");
        data = JSON.stringify(workitemEndUser.WorkItemInstance.WorkItemFileManagement);
        $.ajax('GetAllWorkitemAttachments', {
            type: 'POST',  // http method
            data: data,
            async: false,
            //dataType: 'json',
            contentType: 'application/json',
            success: function (data, status, xhr) {
                $(".AllWorkItemAttachmentGrid_Div").removeClass('hide');
                $("#WIAllAttachments-select-all").prop('checked', false);
                $("#AddFilesMessageDiv").html('');
                $('#AllWorkItemAttachmentGrid tfoot th').each(function () {
                    var val = $(this).data('searchable');
                    if ($(this).data('searchable') === true) {
                        var title = $(this).text();
                        var id = $(this).attr('id');
                        var SearchId = id + 'SearchField';
                        var InputSearchbox;
                        InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                        $(this).html(InputSearchbox);
                    }
                });
                AllFilesList = data;
                if (AllFilesList !== null) {
                    table = $('#AllWorkItemAttachmentGrid').dataTable({
                        "stripeClasses": [],
                        "destroy": true,
                        "processing": false,
                        "orderMulti": false,
                        "filter": false,
                        "searching": false,
                        "order": [1, "asc"],
                        // this is for disable filter (search box)
                        "language": {
                            "emptyTable": function (AllFilesList) {
                                if ((recordsearch === "load" && AllFilesList === 0) || (recordsearch === "load" && AllFilesList === "")) {
                                    return Web_AttachmentCreateMsg;
                                }
                                else {
                                    return Web_AttachmentCreateMsg;
                                }
                            }
                        },
                        "createdRow": function (row, AllFilesList, dataIndex) {
                        },
                        "data": AllFilesList,
                        "columns": [
                            { "data": "", "name": "", "className": "col-md-1", "orderable": false },
                            { "data": "WorkItemInstanceName", "name": "Attachment name", "className": "col-md-3", "orderable": true },
                            { "data": "AttachmentName", "name": "Attachment name", "className": "col-md-3 minwidth", "orderable": true },
                            { "data": "AttachmentType", "name": "Attachment type", "className": "col-md-2", "orderable": true },
                            { "data": "IsAttachementFileOrURL", "name": "File/Link", "className": "col-md-1", "orderable": true },
                            { "data": "Version", "name": "Version", "className": "col-md-1", "orderable": true },
                            {
                                "data": "FileCreatedDate", "name": "Last Updated On", "orderable": true, "type": "ce_datetime", "className": "col-md-3",
                                render: function (taskFilesList, type, row) {
                                    return moment.utc(taskFilesList.replace(/-/g, ' ')).format('DD-MMM-YYYY HH:mm'); //(moment.utc(data, 'YYYY-MM-DDTHH:mm:ssZ').format("DD-MMM-YYYY HH:mm"));
                                }
                            },
                            { "data": "CreatedByName", "name": "User", "className": "col-md-3", "orderable": true },
                            { "data": "AttachmentURL", "name": "FileURL", "className": "hidden", "orderable": false }
                        ],
                        columnDefs: [
                            {
                                "targets": [0],
                                render: function (data, type, row) {
                                    if (data === true) {
                                        return '<input type="checkbox" class ="IsFileSelected" name="id[]" checked value="' + data + '">';
                                    }
                                    else {
                                        return '<input type="checkbox" class ="IsFileSelected Chkbox" name="id[]" value="' + data + '">';
                                    }
                                }
                            },
                            {
                                "targets": [4],
                                render: function (data, type, row) {
                                    return row.IsAttachementFileOrURL === "File" ? '<span class="aicon">F</span>' : '<span class="aicon">L</span>';
                                }
                            }
                        ],
                        "fnDrawCallback": function (oSettings) {
                        }
                    });
                    progress("2");
                }
            }
        });
    });
    $(document).on('keyup change', '#txtAllWorkItemInstanceNameSearchField, #txtAllAttachmentNameSearchField, #txtAllAttachmentTypeSearchField, #txtAllVersionTypeSearchField', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#AllWorkItemAttachmentGrid').DataTable();
        var key = e.which;
        if (key === 9 || key === 16) {
            return false;
        }
        if ($('#txtAllWorkItemInstanceNameSearchField').val() !== "" && key === 16) {
            $("#txtAllWorkItemInstanceNameSearchField").focus();
        }
        SearchColumnName = $(this).parent().parent().data('headername');
        if (SearchColumnName === "WorkItemInstanceName") {
            txtWorkItemName = $('#txtAllWorkItemInstanceNameSearchField').val();
            txtAttachmentName = $('#txtAllAttachmentNameSearchField').val();
            txtAttachmentType = $('#txtAllAttachmentTypeSearchField').val();
            txtVersiontype = $('#txtAllVersionTypeSearchField').val();
            if (txtAttachmentType === undefined) {
                txtAttachmentType = "";
            }
            SearchString = [txtWorkItemName, txtAttachmentName, txtAttachmentType, txtVersiontype];
        }
        else if (SearchColumnName === "AttachmentName") {
            txtWorkItemName = $('#txtAllWorkItemInstanceNameSearchField').val();
            txtAttachmentName = $('#txtAllAttachmentNameSearchField').val();
            txtAttachmentType = $('#txtAllAttachmentTypeSearchField').val();
            txtVersiontype = $('#txtAllVersionTypeSearchField').val();
            if (txtAttachmentType === undefined) {
                txtAttachmentType = "";
            }
            SearchString = [txtWorkItemName, txtAttachmentName, txtAttachmentType, txtVersiontype];
        }
        else if (SearchColumnName === "AttachmentType") {
            txtWorkItemName = $('#txtAllWorkItemInstanceNameSearchField').val();
            txtAttachmentName = $('#txtAllAttachmentNameSearchField').val();
            txtAttachmentType = $('#txtAllAttachmentTypeSearchField').val();
            txtVersiontype = $('#txtAllVersionTypeSearchField').val();
            if (txtAttachmentName === undefined) {
                txtAttachmentName = "";
            }
            SearchString = [txtWorkItemName, txtAttachmentName, txtAttachmentType, txtVersiontype];
        }
        else if (SearchColumnName === "VersionType") {
            txtWorkItemName = $('#txtAllWorkItemInstanceNameSearchField').val();
            txtAttachmentName = $('#txtAllAttachmentNameSearchField').val();
            txtAttachmentType = $('#txtAllAttachmentTypeSearchField').val();
            txtVersiontype = $('#txtAllVersionTypeSearchField').val();
            SearchString = [txtWorkItemName, txtAttachmentName, txtAttachmentType, txtVersiontype];
        }
        url = WebURL + 'WorkitemEnduser/GetAllWIAttachmentsSearchRecords';
        var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
        var Searchdata;
        $.post(url, params, function (data) {
            Searchdata = data;
            recordsearch = "Performed";
            table.clear().rows.add(Searchdata).draw();
        });
    });
    $(document).on('click', '#AllWorkItemAttachmentGrid tbody input[type="checkbox"]', function (e) {
        var $row = $(this).closest('tr');
        var table = $('#AllWorkItemAttachmentGrid').DataTable();
        if (this.checked) {
            $row.addClass('Selected');
        } else {
            $row.removeClass('Selected');
        }
        var rows = table.rows('.Selected').data();
        if (rows.length > 0) {
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').addClass('Button');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').removeClass('Button-disable');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').attr("disabled", false);
            $("#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI").css('cursor', 'pointer');
        }
        else {
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').addClass('Button-disable');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').removeClass('Button');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').attr("disabled", true);
            $("#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI").css('cursor', 'not-allowed');
        }
    });
    $(document).on('click', '#WIAllAttachments-select-all', function (e) {
        var rowcount = 0;
        var table = $('#AllWorkItemAttachmentGrid').DataTable();
        // Check/uncheck all checkboxes in the table
        var rows = table.rows({ 'search': 'applied' }).nodes();
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
        if (this.checked === true) {
            table.rows().every(function () {
                this.nodes().to$().addClass('Selected');
            });
            rowcount = $('#AllWorkItemAttachmentGrid').find('tr.Selected').length;
        }
        else {
            table.rows().every(function () {
                this.nodes().to$().removeClass('Selected');
            });
        }
        if (rowcount > 0) {
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').attr("disabled", false);
            $("#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI").css('cursor', 'pointer');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').addClass('Button');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').removeClass('Button-disable');
        }
        else {
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').attr("disabled", true);
            $("#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI").css('cursor', 'not-allowed');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').addClass('Button-disable');
            $('#btnWIAllAttachSave, #btnWIAllAttachSaveInCreateWI').removeClass('Button');
        }
    });
    $(document).on('click', '#btnWIAllAttachSave', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var SelectedAttachmentIDS;
        var IsFileExistsCount = 0;
        rows_selected = [];
        var table = $('#AllWorkItemAttachmentGrid').DataTable();
        var rows = table.rows('.Selected').data();
        if (rows.length > 0) {
            for (i = 0; i < rows.length; i++) {
                var AttachmentID = rows[i].WorkItemInstanceAttachmentID;
                var AttachmentName = rows[i].AttachmentName;
                var AttachmentType = rows[i].AttachmentType;
                var IsFileOrLink = rows[i].IsAttachementFileOrURL;
                var Isavilable = FileNameDuplicatecheck(AttachmentName, $("#txtWIInstanceID").val(), AttachmentType, IsFileOrLink, 0);
                if (Isavilable.isExists) {
                    IsFileExistsCount++;
                    break;
                }
                else {
                    rows_selected.push(AttachmentID);
                }
            }
            SelectedAttachmentIDS = rows_selected.toString();
            //If file already exists in the work item
            if (IsFileExistsCount > 0) {
                message = Web_WorkitemInstance_AddExistingFileValidateMsg.replace("{0}", IsFileOrLink);
                $('#AddFilesMessageDiv').removeClass('hide');
                $('#AddFilesMessageDiv').html(message);
                $('#AddFilesMessageDiv').addClass('text-danger');
                setTimeout(function () { $("#AddFilesMessageDiv").html(''); }, Web_MsgTimeOutValue);
            }
            else {
                progress("1");
                var params = { selectedAttachments: SelectedAttachmentIDS }; // data to submit
                url = WebURL + 'WorkitemEnduser/AddExistingAttachemtsToWorkItem';
                $.post(url, params, function (data) {
                    $('#wiAllAttachmentsPoup').modal('hide');
                    $('.attachmentGrid').html('');
                    $('.attachmentGrid').html(data);
                    progress("2");
                });
            }
        }
    });
    //Upload attachments in create work item
    $(document).on('click', '#btnwiCreateFileAttachment', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        $('#btnwiCreateFileAttachment').attr("disabled", true);
        $('#btnwiCreateFileAttachment').addClass("Button-disable");
        $('#btnwiCreateFileAttachment').removeClass("Button");
        $("#btnwiCreateFileAttachment").css('cursor', 'not-allowed');

        $.ajax({
            url: WebURL + "/WorkitemEnduser/GetSASToken",
            type: 'GET',
            async: false,
            success: function (res) {
                sasKey = (res.charAt(0) == "?") ? res.substring(1) : res;
            }
        });
        workitemEndUser.WorkItemInstance.WorkItemFileManagementList = [];
        workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = [];
        if ($("input:radio[name='IsAttachementFileOrURL']:checked").val() === "Link") {
            if (workitemEndUser != null || workitemEndUser != undefined) {
                if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                    workitemEndUser = JSON.parse(workitemEndUser);
                }
            }
            workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
            workitemEndUser.WorkItemInstance.WorkItemFileManagementList = [];
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceAttachmentID = $("#hidWorkitemInstAttchmentID").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.FileStorageOption = "Link";
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlAttachmentType option:selected").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlAttachmentType option:selected").text();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentName = $("#attachmentName").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.FilePath = $("#attachmentFileUrlPath").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemID = $("#txtWIInstanceID").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.Size = null;
            var selectedSearchtags = $("#drpSearchTags").val();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
            workitemEndUser.WorkItemInstance.WorkItemFileManagement.NewSearchTag = $("#addTags").val().trim();
            workitemEndUser.WorkItemInstance.WorkItemFileManagementList.push(workitemEndUser.WorkItemInstance.WorkItemFileManagement)
            fileUploadInCreateWI();
        }
        else {
            /* Start of duplicate file upload check */
            var Isavilable = FileNameDuplicatecheck($("#attachmentName").val(), $("#txtWIInstanceID").val(), $("#ddlAttachmentType option:selected").text(), $("input:radio[name='IsAttachementFileOrURL']:checked").val(), 0);
            if (Isavilable.isExists) {
                var CurrentId = $('#attachmentName').attr('id');
                $('.errmsg' + '').remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", Isavilable.fileNames) + '</span>');
                btnFileSaveDisable();
                return false;
            }
            else {
                progress("1");
                processFilesInCreateWI();

                function recallUploadtoDB() {
                    setTimeout(function () {
                        if (fileCount <= 0) {
                            fileUploadInCreateWI();
                        }
                        else {
                            recallUploadtoDB();
                        }
                    }, 200);
                }
                recallUploadtoDB();

            }
            /* End of duplicate file upload check */
        }

    });
    async function processFilesInCreateWI() {

        fileIncr = 0;
        var selectedFiles = $('#WorkItemFileUpload').prop("files");
        fileCount = selectedFiles.length;
        for (var i = 0; i < selectedFiles.length; i++) {
            var proghtml = "<div id='fileName" + i + "' class='col-md-12 text-center'></div><div class='progress col-md-12'><div id='fileprogress" + i + "' class='progress-bar progress-bar-striped' role='progressbar' aria-valuenow=0 aria-valuemin='0' aria-valuemax='100' style='width: 0%'></div></div>";
            $("#progbar").append(proghtml);
            await fileAttachmentUploadInCreateWI(selectedFiles[i]);
        }
    }
    async function fileAttachmentUploadInCreateWI(file1) {
        var file = file1;
        var filename = file.name;
        sessionStorage.clear();
        if (workitemEndUser != null || workitemEndUser != undefined) {
            if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                workitemEndUser = JSON.parse(workitemEndUser);
            }
        }
        if (workitemEndUser.WorkItemInstance.WorkItemFileManagement === null || workitemEndUser.WorkItemInstance.WorkItemFileManagement === undefined) {
            workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
        }
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceAttachmentID = $("#hidWorkitemInstAttchmentID").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.FileStorageOption = "Azure";
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlAttachmentType option:selected").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlAttachmentType option:selected").text();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.FilePath = "";
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemID = $("#txtWIInstanceID").val();
        var selectedSearchtags = $("#drpSearchTags").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.NewSearchTag = $("#addTags").val().trim();

        /* Start of Azure */
        var blobStorageUri = azureUri;
        /* End of Azure */
        var containerName = pendReqContainer;
        /* Start of capturing file attachment details and append to list */
        var wiFileMgmt = workitemEndUser.WorkItemInstance.WorkItemFileManagement;
        var wiFileMgmtList = workitemEndUser.WorkItemInstance.WorkItemFileManagementList;
        var wiFileUploadList = workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList;
        /* End of capturing file attachment details and append to list */
        var blobService = AzureStorage.createBlobServiceWithSas(blobStorageUri, sasKey).withFilter(new AzureStorage.ExponentialRetryPolicyFilter());
        if (!blobService)
            return;

        var sizeInBytes = file.size;
        var convertToKiloBytes = 1024;
        var checkMD5 = false;
        var fileStream = new FileStream(file);

        // Make a smaller block size when uploading small blobs
        var blockSize = sizeInBytes > 1024 * 1024 * 32 ? 1024 * 1024 * 4 : 1024 * 512;
        var options = {
            storeBlobContentMD5: checkMD5,
            blockSize: blockSize,
            contentSettings: {
                contentType: file.type
            }
        };
        blobService.singleBlobPutThresholdInBytes = blockSize;
        var directory = tempWIAttachmentDir + $("#ddlAttachmentType option:selected").val();

        var finishedOrError = false;

        var containerOrError = false;
        var blobExistOrError = false;

        await blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, function (error, result, response) {
            containerOrError = true;
            if (!error && result != null) {
                //console.log('Container exists or not...');
                containerProgress(containerOrError, blobExistsProgress)
            }
        });

        function containerProgress(containerOrError, blobExistsProgress) {
            var isBlobExist;

            blobService.doesBlobExist(containerName, directory + "/" + filename, function (error, result, response) {
                blobExistOrError = true;
                if (error) {
                    console.log('Blob exist error...');
                }
                else if (result != null) {
                    isBlobExist = result.exists;
                    blobExistsProgress(containerOrError, isBlobExist);
                }
            });
        }

        function blobExistsProgress(containerOrError, isBlobExist) {
            if (containerOrError && !isBlobExist) {
                var speedSummary = blobService.createBlockBlobFromStream(containerName, directory + "/" + filename, fileStream, sizeInBytes, options, function (error, result, response) {
                    finishedOrError = true;
                    if (response != null && !response.isSuccessful) {
                        console.log('Upload failed, open brower console for more detailed info.');
                        wiFileUploadList = JSON.parse(sessionStorage.getItem('wiFileUploadList'));
                        if (wiFileUploadList == undefined && wiFileUploadList == null) {
                            wiFileUploadList = [];
                        }
                        wiFileMgmt.FailedFileNames = filename;
                        workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList.push(wiFileMgmt);
                        wiFileUploadList.push(wiFileMgmt);
                        sessionStorage.setItem('wiFileUploadList', JSON.stringify(wiFileUploadList))
                        workitemEndUser.WorkItemInstance.WIAzureFailedFileManagementList = JSON.parse(sessionStorage.getItem('wiFileUploadList'));
                        displayProcess(0, fileIncr, filename);
                        fileCount--;
                        fileIncr++;
                        return true;
                    }
                    else if (containerOrError && result != null) {
                        displayProcess(100, fileIncr, filename, function () {
                            // Prevent alert from stopping UI progress update
                            console.log('Upload successfully...!');
                        });
                        var sasUrl = blobService.getUrl(containerName, directory + "/" + filename);
                        blobService.getBlobProperties(containerName, directory + "/" + filename, function (error, result, response) {
                            blobPropExistOrError = true;
                            wiFileMgmtList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'));
                            if (response != null && response.isSuccessful) {
                                if (wiFileMgmtList == undefined && wiFileMgmtList == null) {
                                    wiFileMgmtList = [];
                                }
                                wiFileMgmt.AttachmentURL = decodeURIComponent(sasUrl);
                                wiFileMgmt.AttachmentName = filename;
                                wiFileMgmt.DBOperation = "Insert";
                                wiFileMgmt.size = sizeInBytes / convertToKiloBytes;
                                wiFileMgmtList.push(wiFileMgmt);
                                sessionStorage.setItem('wiFileMgmtList', JSON.stringify(wiFileMgmtList));
                                workitemEndUser.WorkItemInstance.WorkItemFileManagementList = JSON.parse(sessionStorage.getItem('wiFileMgmtList'));
                                fileCount--;
                                fileIncr++;
                            }
                        });
                    }
                });

                function refreshProgress() {
                    setTimeout(function () {
                        if (!finishedOrError && (containerOrError && blobExistOrError)) {
                            //speedSummary.on('progress', function () {
                            var process = speedSummary.getCompletePercent();
                            displayProcess(process, fileIncr, filename, function () {
                                // Prevent alert from stopping UI progress update
                                console.log('In Progress...!');
                            });
                            //});
                            refreshProgress();
                            console.log('file progress percentage ...' + process);
                        }
                    }, 1000);
                }
                refreshProgress();
            }
        }
    }
    /*  Start of client side slice and stream for upload     */
    function displayProcess(process, fCnt, fName) {
        $("#fileprogress" + fCnt).css("width", process + '%');
        $("#fileprogress" + fCnt).attr("aria-valuenow", process + '%');
        $("#fileprogress" + fCnt).text(process + "%");
        $("#fileName" + fCnt).text(fName);
    }
    function fileUploadInCreateWI() {
        var widata;
        widata = new FormData();
        var fileList = [];
        fileList = workitemEndUser.WorkItemInstance.WorkItemFileManagementList;
        var ModelData = JSON.stringify(fileList);
        widata.append('ModelData', ModelData);
        this.workitemEndUser = workitemEndUser;
        progress("1");
        $.ajax('SaveWIFileAttachmentsInCreateWI', {
            type: 'POST',
            data: widata,
            async: false,
            dataType: 'json',
            processData: false,
            contentType: false, /*'application/json',*/
            success: function (data, status, xhr) {
                progress("2");
                $('#btnwiCreateFileAttachment').attr("disabled", false);
                $('#fileAttachment_div').addClass('hide');
                var FilesList = data.WorkItemInstance.WorkItemFileManagementList;
                if (workitemEndUser != null || workitemEndUser != undefined) {
                    if (workitemEndUser.WorkItemInstance === null || workitemEndUser.WorkItemInstance === undefined) {
                        workitemEndUser = JSON.parse(workitemEndUser);
                    }
                }
                if (workitemEndUser.WorkItemInstance.WorkItemFileManagementList === null || workitemEndUser.WorkItemInstance.WorkItemFileManagementList === undefined) {
                    workitemEndUser.WorkItemInstance.WorkItemFileManagementList = [];
                }
                workitemEndUser.WorkItemInstance.WorkItemFileManagementList = data.WorkItemInstance.AllVersionsWorkItemFileManagementList;
                var Mode = data.WorkItemInstance.CurrentMode;
                loadFileAttachmentsGrid(FilesList, Mode);
            }
        });
    }
    /*  End of client side slice and stream for upload     */
    $(document).on('click', '#btnwiUpdateFileAttachmentInMemory', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (workitemEndUser.WorkItemInstance.WorkItemFileManagement === null || typeof workitemEndUser.WorkItemInstance.WorkItemFileManagement === 'undefined') {
            workitemEndUser.WorkItemInstance.WorkItemFileManagement = {};
        }
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.WorkItemInstanceAttachmentID = $("#hidWorkitemInstAttchmentID").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.IsAttachementFileOrURL = $("input:radio[name='IsAttachementFileOrURL']:checked").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentTypeID = $("#ddlAttachmentType option:selected").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentType = $("#ddlAttachmentType option:selected").text();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.AttachmentName = $("#attachmentName").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.FilePath = $("#attachmentFileUrlPath").val();
        var selectedSearchtags = $("#drpSearchTags").val();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.SearchTags = selectedSearchtags.toString();
        workitemEndUser.WorkItemInstance.WorkItemFileManagement.NewSearchTag = $("#addTags").val().trim();
        var ModelData = JSON.stringify(workitemEndUser.WorkItemInstance.WorkItemFileManagement);
        var data;
        data = new FormData();
        data.append('ModelData', ModelData);
        //this.workitemEndUser = JSON.stringify(workitemEndUser);
        progress("1");
        $.ajax('UpdateWIFileAttachmentsInCreateWI', {
            type: 'POST',
            data: data,
            dataType: 'html',
            processData: false,
            contentType: false,
            success: function (data, status, xhr) {
                progress("2");
                $('.attachmentGrid').html('');
                $('.attachmentGrid').html(data);
                $('#fileAttachment_div').addClass('hide');
            }
        });
    });
    $(document).on('click', '#btnWIAllAttachSaveInCreateWI', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var SelectedAttachmentIDS;
        var IsFileExistsCount = 0;
        rows_selected = [];
        var table = $('#AllWorkItemAttachmentGrid').DataTable();
        var rows = table.rows('.Selected').data();
        if (rows.length > 0) {
            for (i = 0; i < rows.length; i++) {
                var AttachmentID = rows[i].WorkItemInstanceAttachmentID;
                var AttachmentName = rows[i].AttachmentName;
                var AttachmentType = rows[i].AttachmentType;
                var IsFileOrLink = rows[i].IsAttachementFileOrURL;
                var Isavilable = FileNameDuplicatecheck(AttachmentName, $("#txtWIInstanceID").val(), AttachmentType, IsFileOrLink, 0);
                if (Isavilable.isExists) {
                    IsFileExistsCount++;
                    break;
                }
                else {
                    rows_selected.push(AttachmentID);
                }
            }
            SelectedAttachmentIDS = rows_selected.toString();
            //If file already exists in the work item
            if (IsFileExistsCount > 0) {
                message = Web_WorkitemInstance_AddExistingFileValidateMsg.replace("{0}", IsFileOrLink);
                $('#AddFilesMessageDiv').removeClass('hide');
                $('#AddFilesMessageDiv').html(message);
                $('#AddFilesMessageDiv').addClass('text-danger');
                setTimeout(function () { $("#AddFilesMessageDiv").html(''); }, Web_MsgTimeOutValue);
            }
            else {
                progress("1");
                var params = { selectedAttachments: SelectedAttachmentIDS }; // data to submit
                url = WebURL + 'WorkitemEnduser/AddExistingAttachemtsToWorkItemInCreate';
                $.post(url, params, function (data) {
                    $('#wiAllAttachmentsPoup').modal('hide');
                    $('.attachmentGrid').html('');
                    $('.attachmentGrid').html(data);
                    progress("2");
                });
            }
        }
    });
    //End
    // End of file attachment code
    $(document).on('click', '.Addresourceresponsibility', function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var res = true;
        CurrentRowId = 1;
        Resourcegrid = false;
        if (Resourcegrid) {
            $("#Resourcegrid").find('tr').each(function () {

                if ($(this).index() == CurrentRowId) {

                    $(this).addClass('RowWarning');
                }
            });
            $("#ResponsibilityWarning").removeClass('hide');
            $("#ResponsibilityDupicateWarning").addClass('hide');
            res = false;
        }

        if (res) {
            var rowId = $('#Resourcegrid tr:last').index();
            //rowId != workitemEndUser.responsibilitieslist.length - 1
            if (workitemEndUser.responsibilitieslist != null && workitemEndUser.responsibilitieslist.length > 0) {
                if (workitemEndUser.WorkItemInstance != null) {
                    var data = JSON.stringify(workitemEndUser);
                    $.ajax('AddNewResponsibilityRow', {
                        type: 'POST',  // http method
                        data: data,
                        async: false,
                        dataType: 'html',
                        contentType: 'application/json',
                        success: function (data, status, xhr) {

                            $(".addresourcesrespons").html('');
                            $(".addresourcesrespons").html(data);

                            var rId = $('#Resourcegrid tr:last').index();
                            $('#Resourcegrid tr:last').addClass("AddedNewRow");

                            $('#Respons' + rId).addClass("hide");
                            $('#Resource' + rId).addClass("hide");
                            $("#ddlTaskRelation" + rId).removeClass("hide");
                            // $("#ddlWorkspaceList" + rId).removeClass("hide");
                            //$("#ddlWorkItem" + rId).removeClass("hide");
                            //$("#ddlWorkflow" + rId).removeClass("hide");
                            //$("#ddlWorkflowTask" + rId).removeClass("hide");

                            $('.btnadd' + rId).removeClass("hide");

                            $('.btnedt' + rId).addClass('hide');
                            $('.btnremv' + rId).addClass("hide");
                            //$.post('GetUserResponsibilities', function (data, status) {
                            //    if (status == 'success') {
                            //        if (data.length > 0) {
                            //            $("#ddlTaskRelation" + rId).empty();
                            //            var defaultOpt = "<option value='-1' selected='selected'>-- Select a responsibilities--</option>"
                            //            $("#ddlTaskRelation" + rId).prepend(defaultOpt);
                            //            $.each(data, function (i, state) {
                            //                $("#ddlTaskRelation" + rId).append('<option value="' + data[i].Id + '">' +
                            //                    data[i].Name + '</option>');
                            //            });
                            //        }
                            //    }
                            //    else {
                            //        ShowModalDialog('Alert!', 'No User Responsibilities', false);
                            //    }
                            //});
                            /*
                                * For New Dependecy Addtion*
                                *  Loading Dropdowns       *
                               *                          */
                            CurrentRowId = rId;
                            ddlTaskRelationOnChange(rId);
                        }
                    });
                }
            }
            else {
                var msg = Web_WiEnduserRespNotAvail;
                $('#wIRespAdd').removeClass('hide');
                $('#wIRespAdd').removeClass('txtcolourforestgreen');
                $('#wIRespAdd').addClass('text-danger');
                $('#wIRespAdd').html(Web_WiEnduserRespNotAvail);
                window.scrollTo(0, 0);
                setTimeout(function () { $("#wIRespAdd").html(''); }, Web_MsgTimeOutValue);
                return false;
            }
        }
        $('#ddlTaskRelation' + CurrentRowId).focus();
    });

    function ddlTaskRelationOnChange(rId) {
        $(document).on('change', '#ddlTaskRelation' + rId, function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (rId >= 0) {
                $('#ddlTaskRelation' + rId).removeClass('Warning');
                var selectResVal = $('#ddlTaskRelation' + rId + ' option:selected').val();
                var selectResText = $('#ddlTaskRelation' + rId + ' option:selected').text();
                var selectResIndex = $('#ddlTaskRelation' + rId + ' option:selected').index();
                var data = JSON.stringify(workitemEndUser);
                $.ajax('GetUserDefaultResponsibilities', {
                    type: "GET",
                    data: { selectedRespValue: selectResVal, selectedRespName: selectResText },
                    dataType: 'html',
                    async: false,
                    contentType: 'application/json',
                    success: function (data) {
                        if (data != null) {
                            $(".addresourcesrespons").html('');
                            $(".addresourcesrespons").html(data);
                            $('#ddlTaskRelation' + rId).prop("selectedIndex", selectResIndex);
                            $('#ddlTaskRelation' + rId).focus();
                            $('#ddlTaskRelation' + rId).select(selectResVal);
                        }
                    },
                    error: function (result) {
                    }
                });
            }
        });
    }


    $(document).on('click', '#btneditResource, #btnAddresource', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        rId = $(this).closest("tr").index();
        CurrentRowId = rId;
        var rowcount = 0;
        var selectedrow;
        //var selresponsbility = 0, selresourceId = 0;
        if (workitemEndUser.WorkItemInstance.WorkItemResourcesList != null) {
            for (i = 0; i < workitemEndUser.WorkItemInstance.WorkItemResourcesList.length; i++) {
                if (workitemEndUser.WorkItemInstance.WorkItemResourcesList[i].Sequence == (rId + 1)) {
                    selresponsbility = workitemEndUser.WorkItemInstance.WorkItemResourcesList[i].ResponsibilityID;
                }
            }
        }
        //selresponsbility = workitemEndUser.WorkItemInstance.WorkItemResourcesList[rId].ResponsibilityID;
        //selresourceId = workitemEndUser.WorkItemInstance.WorkItemResourcesList[rId].WorkItemResourcesList;
        if (selresponsbility == 0) {
            //rId = $('#Resourcegrid tr:last').index();
            selresponsbility = $('#ddlTaskRelation' + rId + ' option:selected').val();
            $('#btnwiretnusersave').attr("disabled", false);
            $("#btnwiretnusersave").addClass('Button');
            $("#btnwiretnusersave").removeClass('Button-disable');
        }
        else {
            $('#btnwiretnusersave').attr("disabled", false);
            $("#btnwiretnusersave").addClass('Button');
            $("#btnwiretnusersave").removeClass('Button-disable');
        }

        var responsibility = selresponsbility;
        SelectedResponsbility = selresponsbility;
        if (responsibility >= 0) {
            $.post('GetUserResponsibilities', { responsibility: responsibility }, function (data, status) {
                if (data != null) {
                    $('#WIresourcesPoup').modal('show');
                    var List = data;
                    table3 = $('#wiResourceslist').DataTable({
                        "stripeClasses": [],
                        "destroy": true,
                        "processing": false,
                        "orderMulti": false,
                        "filter": false,
                        "pageLength": 7,
                        "dom": '<"toolbar">frtip',
                        //"searching": true,
                        "order": [4, "asc"],
                        "paging": true,
                        //"scrollY": '50vh',
                        //"scrollX": true,
                        "language": {
                            "emptyTable": function (data) {
                                if ((recordsearch == "load" && data == "0") || (recordsearch == "load" && data == "")) {
                                    $('#btnwiretnusersave').attr("disabled", true);
                                    $("#btnwiretnusersave").addClass('Button-disable');
                                    $("#btnwiretnusersave").removeClass('Button');
                                    return "No users exists";
                                }
                                else {
                                    $('#btnwiretnusersave').attr("disabled", false);
                                    $("#btnwiretnusersave").addClass('Button');
                                    $("#btnwiretnusersave").removeClass('Button-disable');
                                    return "No users exists";
                                }
                            }
                        },
                        "data": List,
                        "createdRow": function (row, data, dataIndex) {
                            var rowId = data.UserID;
                            if (data.SelectedResources == true) {
                                $(row).addClass('selected');
                            }
                            // If row ID is in the list of selected row IDs
                            else if ($.inArray(rowId, rows_selected) !== -1) {
                                $(row).find('input[type="checkbox"]').prop('checked', true);
                                $(row).addClass('selected');
                            }
                        },
                        "select": {
                            "style": 'os',
                            "selector": 'td:first-child'
                        },
                        "columns": [

                            { "data": "UserID", "name": "ID", "className": "hidden", "orderable": false },
                            { "data": "SelectedResources", "name": "ID", "className": "col-md-1", "orderable": false },
                            { "data": "ContractorName", "name": "ContractorName", "className": "col-md-2", "orderable": true },
                            { "data": "ResponsibilityID", "name": "ResponsibilityID", "className": "hidden", "orderable": false },
                            { "data": "UserName", "name": "UserName", "className": "col-md-2 clswhitespace", "orderable": true },
                            {
                                //"data": "ResponsibilityName", "name": "Responsibility", "className": "", "orderable": false, //"sType": 'string-case',       
                                "data": "GroupList", "name": "Responsibility", "className": "col-md-3", "orderable": true, //"sType": 'string-case',                            
                                render: function (data, type, row) {
                                    //var arr = data.split(',');
                                    ////arr.shift();
                                    //var litemp = "<ul style='text-align: left;'>";
                                    //$.each(arr, function (index, value) {
                                    //    litemp += "<li class='clswhitespace'>" + value + "</li>";
                                    //});
                                    //litemp += "</ul>";
                                    //if (data.split(',').length > 1) {
                                    //    return litemp;
                                    //}
                                    //else {
                                    //    //return "<ul style='text-align: left;'><li>" + data + "</li></ui>";
                                    //    return "";
                                    //}

                                    //arr.shift();
                                    var litemp = "<ul style='text-align: left;'>";
                                    $.each(data, function (index, value) {
                                        var yes = "";
                                        if (value.PrimaryContact == 1) {
                                            yes = "<i class='fa fa-user' style='color:#3c8dbc'></i>";
                                        }
                                        litemp += "<li class='clswhitespace'>" + value.ResponsibilityName + "               " + yes + "</li>";

                                    });
                                    litemp += "</ul>";
                                    if (data.length > 0) {
                                        return litemp;
                                    }
                                    else {
                                        //return "<ul style='text-align: left;'><li>" + data + "</li></ui>";
                                        return "";
                                    }
                                }
                            },
                            {
                                "data": "Workspaces", "name": "Workspaces", "className": "col-md-2", "orderable": true, //"sType": 'string-case',                            
                                render: function (data, type, row) {
                                    var arr = data.split(',');
                                    //arr.shift();
                                    var litemp = "<ul style='text-align: left;'>";
                                    $.each(arr, function (index, value) {
                                        litemp += "<li class='clswhitespace'>" + value + "</li>";
                                    });
                                    litemp += "</ul>";
                                    if (data.length > 0) {
                                        return litemp;
                                    }
                                    else {
                                        //return "<ul style='text-align: left;'><li>" + data + "</li></ui>";
                                        return "";
                                    }
                                }
                            },
                            {
                                "data": "Styles", "name": "Styles", "className": "col-md-1", "orderable": true, //"sType": 'string-case',                            
                                render: function (data, type, row) {
                                    var arr = data.split(',');
                                    //arr.shift();
                                    var litemp = "<ul style='text-align: left;'>";
                                    $.each(arr, function (index, value) {
                                        litemp += "<li class='clswhitespace'>" + value + "</li>";
                                    });
                                    litemp += "</ul>";
                                    if (data.length > 0) {
                                        return litemp;
                                    }
                                    else {
                                        //return "<ul style='text-align: left;'><li>" + data + "</li></ui>";
                                        return "";
                                    }
                                }
                            },
                            {
                                "data": "SubjectAreas", "name": "SubjectAreas", "className": "col-md-1", "orderable": true, //"sType": 'string-case',                            
                                render: function (data, type, row) {
                                    var arr = data.split(',');
                                    //arr.shift();
                                    var litemp = "<ul style='text-align: left;'>";
                                    $.each(arr, function (index, value) {
                                        litemp += "<li class='clswhitespace'>" + value + "</li>";
                                    });
                                    litemp += "</ul>";
                                    if (data.length > 0) {
                                        return litemp;
                                    }
                                    else {
                                        //return "<ul style='text-align: left;'><li>" + data + "</li></ui>";
                                        return "";
                                    }
                                }
                            },
                            {
                                "data": "UserNotes", "name": "UserNotes", "className": "col-md-1 clswhitespace", "orderable": false,
                                render: function (data, type, row) {
                                    var arr = data.split(',');
                                    //arr.shift();
                                    var litemp = "<ul style='text-align: left;'>";
                                    $.each(arr, function (index, value) {
                                        litemp += "<li class='clswhitespace'>" + value + "</li>";
                                    });
                                    litemp += "</ul>";
                                    if (data.length > 0) {
                                        return litemp;
                                    }
                                    else {
                                        //return "<ul style='text-align: left;'><li>" + data + "</li></ui>";
                                        return "";
                                    }
                                }
                            }
                            //{ "data": "UserNotes", "name": "UserNotes", "className": "col-md-1 clswhitespace", "orderable": false }
                        ],
                        'columnDefs': [{
                            'targets': 1,
                            'searchable': false,
                            'orderable': false,
                            'className': 'dt-body-center',
                            'render': function (data, type, row, full, meta) {
                                if (data == true) {
                                    return '<input type="checkbox" data_userid="' + row.UserID + '" class ="Chkbox" name="id[]" checked value="' + data + '">';
                                }
                                else {
                                    return '<input type="checkbox" data_userid="' + row.UserID + '" class ="Chkbox" name="id[]" value="' + data + '">';
                                }
                            }
                        },
                        {
                            "targets": [2],
                            render: function (data, type, row) {
                                //return '<span style="cursor: pointer;" class="ViewEditableMetadata linkcolour EditableMetadataNameColumns">' + data + '</span>';
                                if (row.ContractorName != '') {
                                    return data + '<br/><span style="cursor: pointer;" ContractorId=' + row.ContractorId + ' class="underline linkcolour lnkResBillRts">View rates</span>';
                                }
                                else {
                                    return '';
                                }
                            }
                        },
                        {
                            "targets": [4],
                            render: function (data, type, row) {
                                //return '<span style="cursor: pointer;" class="ViewEditableMetadata linkcolour EditableMetadataNameColumns">' + data + '</span>';
                                if (row.IsPrimaryUser == 1) {
                                    return data + "                <i class='fa fa-user' style='color:#3c8dbc'></i>";
                                }
                                else {
                                    return data + " ";
                                }
                            }
                        }

                        ],
                        drawCallback: function () {
                        }
                    });
                    ResourceList = $('#wiResourceslist').DataTable().rows().data();
                    rowcount = $('#wiResourceslist').find('tr.selected').length;
                    if (rowcount > 0) {
                        btnUsersSaveEnable();
                    }
                    else {
                        btnUsersSaveDisable();
                    }

                    //$('#wiResourceslist tr').on('click', 'input[type="radio"]', function (e) {                    
                    //    $('tr').removeClass('selected'); // removes all highlights from tr's
                    //    $(this).addClass('selected'); // adds the highlight to this row
                    //    var $row = $(this).closest('tr');
                    //    $row.addClass('selected');
                    //    $('#btnwiretnusersave').attr("disabled", false);
                    //    ////$row.addClass('addresource');
                    //    // Get row data                    
                    //    var data = table3.row($row).data();
                    //    /////$row.removeClass('selected');
                    //    // Get Responsibility ID
                    //    var ResponsibilityID = data.ResponsibilityID;
                    //    e.stopPropagation();
                    //});

                    //Billing rates for resource popup.
                    $('.lnkResBillRts').on('click', function (e) {
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        var ContractorId = $(".lnkResBillRts").attr('ContractorId');
                        var url = WebURL + "ExternalResource/BillingRates?ContractorId=" + ContractorId;
                        window.open(url);
                    });

                    $('#wiResourceslist-select-all').on('click', function () {
                        rows_selected = [];
                        var rowcount = 0;
                        // Check/uncheck all checkboxes in the table
                        var rows = table3.rows({ 'search': 'applied' }).nodes();
                        $('input[type="checkbox"]', rows).prop('checked', this.checked);
                        if (this.checked == true) {
                            for (var i = 0; i < ResourceList.length; i++) {
                                ResourceList[i].SelectedResources = true;
                            }
                            table3.rows().every(function () {
                                var data = this.data();
                                rows_selected.push(data.UserID);
                                this.nodes().to$().addClass('selected');
                            });
                            rowcount = $('#wiResourceslist').find('tr.selected').length;
                        }
                        else {
                            for (var i = 0; i < ResourceList.length; i++) {
                                ResourceList[i].SelectedResources = false;
                            }
                            table3.rows().every(function () {
                                this.nodes().to$().removeClass('selected');
                            });
                        }
                        if (rowcount > 0) {
                            btnUsersSaveEnable();
                        }
                        else {
                            btnUsersSaveDisable();
                        }
                    });

                    // Handle click on checkbox to set state of "Select all" control
                    $('#wiResourceslist tbody').on('change', 'input[type="checkbox"]', function () {
                        // If checkbox is not checked
                        if (!this.checked) {
                            var el = $('#wiResourceslist-select-all').get(0);
                            // If "Select all" control is checked and has 'indeterminate' property
                            if (el && el.checked && ('indeterminate' in el)) {
                                // Set visual state of "Select all" control 
                                // as 'indeterminate'
                                el.indeterminate = true;
                            }
                        }
                    });



                    $('#wiResourceslist tbody').on('click', 'input[type="checkbox"]', function (e) {
                        var $row = $(this).closest('tr');
                        var table2 = $("#wiResourceslist").DataTable();
                        // Get row data
                        var data = table3.row($row).data();

                        // Get Workitem Instnace ID
                        var UserID = data.UserID;

                        var s = rows_selected;
                        // Determine whether Workitem Instnace ID is in the list of selected row IDs
                        //var index = $.inArray(UserID, rows_selected);

                        // If checkbox is checked and row ID is not in list of selected row IDs
                        //if (this.checked && index === -1) {

                        //    rows_selected.push(UserID);

                        //    // Otherwise, if checkbox is not checked and Workitem Instnace ID is in list of selected row IDs
                        //} else if (!this.checked && index !== -1) {
                        //    rows_selected.splice(index, 1);
                        //}
                        if (this.checked) {
                            $row.addClass('selected');
                            var uid = $(this).attr('data_userid')
                            for (var i = 0; i < ResourceList.length; i++) {
                                if (ResourceList[i].UserID == uid) {
                                    ResourceList[i].SelectedResources = true;
                                }
                            }
                            btnUsersSaveEnable();
                        } else {
                            $row.removeClass('selected');
                            var usid = $(this).attr('data_userid')
                            for (var i = 0; i < ResourceList.length; i++) {
                                if (ResourceList[i].UserID == usid) {
                                    ResourceList[i].SelectedResources = false;
                                }
                            }
                            rowcount = $('#wiResourceslist').find('tr.selected').length;
                            if (rowcount > 0) {
                                btnUsersSaveEnable();
                            }
                            else {
                                btnUsersSaveDisable();
                            }
                        }

                        ////////////////////////////////////////////////////////alert(rows_selected.length);
                        // Update state of "Select all" control
                        //updateDataTableSelectAllCtrl(table3);

                        // Prevent click event from propagating to parent
                        e.stopPropagation();
                    });

                    // Handle click on table cells with checkboxes
                    $('#wiResourceslist').on('click', 'tbody td, thead th:first-child', function (e) {
                        $(this).parent().find('input[type="checkbox"]').trigger('click');
                    });

                    // Handle click on "Select all" control
                    $('thead input[name="select_all"]', table3.table().container()).on('click', function (e) {
                        if (this.checked) {
                            $('#wiResourceslist tbody input[type="checkbox"]:not(:checked)').trigger('click');
                        } else {
                            $('#wiResourceslist tbody input[type="checkbox"]:checked').trigger('click');
                        }

                        // Prevent click event from propagating to parent
                        e.stopPropagation();
                    });

                    // Handle table draw event
                    table3.on('draw', function () {
                        // Update state of "Select all" control
                        //updateDataTableSelectAllCtrl(table3);
                    });


                    // Handle form submission event 
                    $('#btnwiretnusersave').on('click', function (e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        var form = $("#wireltnusergrid");
                        $('#txtUserNameSearchField').val("");
                        $('#txtResponsibilitySearchField').val("");
                        var table2 = $("#wiResourceslist").DataTable();
                        //var rows = table2.rows('.selected').data();
                        var rows = ResourceList.filter(res => res.SelectedResources == true);
                        for (i = 0; i < rows.length; i++) {
                            var users = rows[i].UserID;
                            var index = $.inArray(users, rows);
                            if (this.checked && index === -1) {
                                rows_selected.push(users);
                                // Otherwise, if checkbox is not checked and Workitem Instnace ID is in list of selected row IDs
                            } else if (!this.checked && index !== -1) {
                                rows_selected.splice(index, 1);
                            }
                            else {
                                rows_selected.push(users);
                            }
                        }
                        // Iterate over all selected checkboxes
                        $.each(rows_selected, function (index, UserID) {
                            // Create a hidden element 
                            $(form).append(
                                $('<input>')
                                    .attr('type', 'hidden')
                                    .attr('name', 'id[]')
                                    .val(UserID)
                            );
                        });

                        var resp = selresponsbility;

                        // Sends the selected Workitem Ids to the Loading 
                        data = rows_selected.toString();
                        $.ajax('SelectedUsersforResourceAllocation', {
                            type: 'Get',  // http method
                            async: false,
                            dataType: 'html',
                            contentType: 'application/json',
                            data: { data: data, responsibility: resp },  // data to submit
                            success: function (data, status, xhr) {
                                $(".addresourcesrespons").html('');
                                $(".addresourcesrespons").html(data);
                                $('.modal-backdrop').remove();
                                $('.btnedt' + rId).removeClass('hide');
                                $('.btnadd' + rId).addClass("hide");
                                $('.btnremv' + rId).removeClass("hide");
                                CheckMandatoryResponsibility("2");
                            }
                        });

                        $('.wireltnuserclose').on('click', function (e) {
                            //re drwas the data table so that all checked checkboxes will be un checked 
                            // 
                            //table3.clear().rows.add(List).draw();
                            rows_selected = [];
                            $('#wiResourceslist').DataTable().destroy();
                            $('#wiResourceslist').DataTable().draw();
                        });
                        // FOR DEMONSTRATION ONLY     
                        // Output form data to a console     
                        //$('#example-console').text($(form).serialize());
                        //console.log("Form submission", $(form).serialize());
                        // Remove added elements
                        $('input[name="id\[\]"]', form).remove();
                        rows_selected = [];
                        e.preventDefault();
                    });
                }
            });
        }
    });
    $(document).on('click', "input[type='radio'][id=defaultassignee]", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var Userid = $(this).val();
        var rId;
        rId = $(this).closest("tr").index();
        CurrentRowId = rId;
        var selectedrow;
        var selresponsbility, selresourceId;
        if (workitemEndUser.WorkItemInstance.WorkItemResourcesList != null) {
            selresponsbility = workitemEndUser.WorkItemInstance.WorkItemResourcesList[rId].ResponsibilityID;
        }
        else {
            selresponsbility = $("#responID" + rId).val();
        }
        //alert(selresponsbility);

        $.ajax('SelectedUsersPerRes', {
            type: 'Get',  // http method
            async: false,
            dataType: 'html',
            contentType: 'application/json',
            data: { userID: Userid, responsibility: selresponsbility },  // data to submit
            success: function (data, status, xhr) {
                $(".addresourcesrespons").html('');
                $(".addresourcesrespons").html(data);
                $('.btnedt' + rId).removeClass('hide');
                $('.btnadd' + rId).addClass("hide");
                $('.btnremv' + rId).removeClass("hide");
            }
        });
    });

    $(document).on('mouseenter', "#sortable", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#sortable").sortable({
            items: 'tr',
            cursor: 'pointer',
            axis: 'y',
            dropOnEmpty: false,
            start: function (e, ui) {
                ui.item.addClass("selected");
            },
            stop: function (e, ui) {
                ui.item.removeClass("selected");
                //$(this).find("tr").each(function (index) {


                // document.getElementById('info').innerHTML = "";
                var table = document.getElementById("Resourcegrid");

                // LOOP THROUGH EACH ROW OF THE TABLE AFTER HEADER.
                for (i = 1; i < table.rows.length; i++) {

                    // GET THE CELLS COLLECTION OF THE CURRENT ROW.
                    var objCells = table.rows.item(i).cells;

                    var responsibilityId = objCells.item(0).innerText;
                    for (j = 0; j < workitemEndUser.WorkItemInstance.WorkItemResourcesList.length; j++) {
                        if (workitemEndUser.WorkItemInstance.WorkItemResourcesList[j].ResponsibilityName === responsibilityId) {
                            workitemEndUser.WorkItemInstance.WorkItemResourcesList[j].Sequence = i;
                            break;
                        }
                    }
                }
                //});
                var sampledata = workitemEndUser.WorkItemInstance.WorkItemResourcesList;
                $.ajax('SetResourceListSequence', {
                    type: 'POST',  // http method    
                    async: false,
                    dataType: 'html',
                    data: { workitemResourceList: sampledata },  // data to submit
                    //contentType: "application/json",
                    success: function (data, status, xhr) {
                        $(".addresourcesrespons").html('');
                        $(".addresourcesrespons").html(data);
                    }
                });
            }
        });
    });

    $(document).on('keyup', '#txtVendorNameSearchField,#txtUserNameSearchField, #txtResponsibilitySearchField, #txtWorkspaceNameSearchField', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#wiResourceslist').DataTable();
        var key = e.which;
        if (key == 9 || key == 16) {
            return false;
        }
        if ($('#txtUserNameSearchField').val() != "" && key == 16) {
            $("#txtUserNameSearchField").focus();
        }
        var IsPrimary = $("#chkPrimaryRes").prop('checked')
        var Vendorname = $("#txtVendorNameSearchField").val();
        var Usernamevalue = $("#txtUserNameSearchField").val();
        var Responsibilityvalue = $("#txtResponsibilitySearchField").val();
        var Workspacevalue = $("#txtWorkspaceNameSearchField").val();
        var SearchColumnName = $(this).parent().parent().data('headername');
        //var  SearchColumnName = $(this).data('headername');

        //if (SearchColumnName == "User name") {
        //    Usernamevalue = $(this).val();
        //    Responsibilityvalue = Responsibilityvalue;
        //    if (Responsibilityvalue == undefined) {
        //        Responsibilityvalue = "";
        //    }
        //    SearchString = [Usernamevalue, Responsibilityvalue];
        //}
        //else if (SearchColumnName == "Responsibility") {
        //    if (Usernamevalue == undefined) {
        //        Usernamevalue = "";
        //    }
        //    Usernamevalue = Usernamevalue;
        //    Responsibilityvalue = $(this).val();
        //    SearchString = [Usernamevalue, Responsibilityvalue];
        //}
        //else if (SearchColumnName == "Vendor name") {
        //    if (VenderNamevalue == undefined) {
        //        VenderNamevalue = "";
        //    }
        //    Usernamevalue = Usernamevalue;
        //    VenderNamevalue = $(this).val();
        //    SearchString = [Usernamevalue, Responsibilityvalue];
        //}

        if (SearchColumnName == "User name" || SearchColumnName == "Responsibility" || SearchColumnName == "Vendor name" || SearchColumnName == "WorkspaceName") {
            SearchString = [Vendorname, Usernamevalue, Responsibilityvalue, Workspacevalue];
        }
        url = WebURL + 'WorkitemEnduser/GetSearchRecords';
        var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, responsibility: SelectedResponsbility, IsPrimary: IsPrimary };
        var Searchdata;
        $.post(url, params, function (data) {
            Searchdata = data;
            recordsearch = "Performed";
            table.clear().rows.add(Searchdata).draw();
        });
    });


    $(document).on('change', '#chkPrimaryRes', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#wiResourceslist').DataTable();
        var key = e.which;
        if (key == 9 || key == 16) {
            return false;
        }
        if ($('#txtUserNameSearchField').val() != "" && key == 16) {
            $("#txtUserNameSearchField").focus();
        }
        var IsPrimary = $("#chkPrimaryRes").prop('checked')
        var Vendorname = $("#txtVendorNameSearchField").val();
        var Usernamevalue = $("#txtUserNameSearchField").val();
        var Responsibilityvalue = $("#txtResponsibilitySearchField").val();
        var Workspacevalue = $("#txtWorkspaceNameSearchField").val();
        var SearchColumnName = $(this).parent().parent().data('headername');

        if (Vendorname == '' && Usernamevalue == '' && Responsibilityvalue == '' && Workspacevalue == '') {
            return false;
        }

        //var  SearchColumnName = $(this).data('headername');

        //if (SearchColumnName == "User name") {
        //    Usernamevalue = $(this).val();
        //    Responsibilityvalue = Responsibilityvalue;
        //    if (Responsibilityvalue == undefined) {
        //        Responsibilityvalue = "";
        //    }
        //    SearchString = [Usernamevalue, Responsibilityvalue];
        //}
        //else if (SearchColumnName == "Responsibility") {
        //    if (Usernamevalue == undefined) {
        //        Usernamevalue = "";
        //    }
        //    Usernamevalue = Usernamevalue;
        //    Responsibilityvalue = $(this).val();
        //    SearchString = [Usernamevalue, Responsibilityvalue];
        //}
        //else if (SearchColumnName == "Vendor name") {
        //    if (VenderNamevalue == undefined) {
        //        VenderNamevalue = "";
        //    }
        //    Usernamevalue = Usernamevalue;
        //    VenderNamevalue = $(this).val();
        //    SearchString = [Usernamevalue, Responsibilityvalue];
        //}

        if (SearchColumnName == "User name" || SearchColumnName == "Responsibility" || SearchColumnName == "Vendor name" || SearchColumnName == "WorkspaceName") {
            SearchString = [Vendorname, Usernamevalue, Responsibilityvalue, Workspacevalue];
        }
        url = WebURL + 'WorkitemEnduser/GetSearchRecords';
        var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, responsibility: SelectedResponsbility, IsPrimary: IsPrimary };
        var Searchdata;
        $.post(url, params, function (data) {
            Searchdata = data;
            recordsearch = "Performed";
            table.clear().rows.add(Searchdata).draw();
        });
    });

    $("#ddlrelatedwspaceInstance").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var selectedIndex = $('#ddlrelatedwspaceInstance option:selected').index();
        if (selectedIndex > 0) {
            $("#ddlwITemplate").empty();
            var defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#ddlwITemplate").prepend(defaultOpt);
            $.post('GetwiTemplateRelatedWorkspace', { workSpaceId: $("#ddlrelatedwspaceInstance").val() }, function (data, status) {
                if (status === 'success') {
                    if (data.length > 0) {
                        $.each(data, function (i, state) {
                            $("#ddlwITemplate").append('<option value="' + data[i].Value + '">' +
                                data[i].Text + '</option>');
                        });
                    }
                }
                else {
                    ShowModalDialog('Alert!', 'No multiple content type in previous level', false);
                }
            });
        }
        else {
            $("#ddlwITemplate").empty();
            defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#ddlwITemplate").prepend(defaultOpt);
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('#btnbasicinfonext').removeClass('Button');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
    });

    $('.wirelatedwitable').on('click', '.wiUnrelate', function (e) {
        $(this).closest("tr").find('input').each(function () {
            if ($(this).attr("id") == "rowId") {
                rId = $(this).val();
            }
        });
        var WSID = $("#relWiWorkspace" + rId).val();
        var pWIID = $("#relParent" + rId).val();
        var cWIID = $("#relChild" + rId).val();
        e.preventDefault();
        e.stopImmediatePropagation();
        $.ajax('/WorkitemEnduser/UnrelateWIRelationship', {
            type: 'POST',  // http method
            data: { workspace: WSID, parentWorkitem: pWIID, childWorkitem: cWIID },  // data to submit
            success: function (data, status, xhr) {
                $(".relatedworkItems").html('');
                $(".relatedworkItems").html(data);
            }

        });
    });

    $('.wirelatedwitable').on('click', '.wiRelate', function (e) {
        $(".greyoutf").removeClass('disabled');
        $(this).closest("tr").find('input').each(function () {
            if ($(this).attr("id") == "rowId") {
                rId = $(this).val();
            }
        });
        var WSID = $("#relWiWorkspace" + rId).val();
        var pWIID = $("#relParent" + rId).val();
        var cWIID = $("#relChild" + rId).val();
        e.preventDefault();
        e.stopImmediatePropagation();
        $.ajax('/WorkitemEnduser/RelateWIRelationship', {
            type: 'POST',  // http method
            data: { workspace: WSID, parentWorkitem: pWIID, childWorkitem: cWIID },  // data to submit
            success: function (data, status, xhr) {
                $(".relatedworkItems").html('');
                $(".relatedworkItems").html(data);
            }

        });
    });

    $("#relatewswis").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist == null) {
            workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist = [];
        }
        if (workitemEndUser.workItemRelatedWorkItems == null) {
            workitemEndUser.workItemRelatedWorkItems = [];
        }
        var WSID = $("#relatedwsddl option:selected").val();
        var WIID = $('#wsRelatedSelectedWII').val();
        //var WIID = $("#relatedwiwsddl option:selected").val();
        var RELID = $("#relatedRelationship option:selected").text();
        var REL = $("#relatedRelationship option:selected").val();
        var res = RelatedWorkitemsDuplicateCheck(WIID, WSID, RELID);
        var defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
        if (res == true) {
            workitemEndUser.workItemRelatedWorkItems.WorkspaceInstanceID = WSID;
            workitemEndUser.workItemRelatedWorkItems.WorkItemInstanceID = WIID;
            workitemEndUser.workItemRelatedWorkItems.Relationship = $("#relatedRelationship option:selected").val();
            var list = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist;
            var data = $(".wiInstance").serialize();

            $.ajax('/WorkitemEnduser/wiRelatedWorkItemsrelationship', {
                type: 'POST',
                data: data,
                async: false,
                //dataType: 'json',
                //contentType: 'application/json',
                success: function (data, status, xhr) {
                    if (data !== null) {
                        // alert("yes");
                        $(".relatedworkItems").html('');
                        $(".relatedworkItems").html(data);
                        $("#relatedwsddl").prop('selectedIndex', 0);
                        //$("#relatedwiwsddl").prop('selectedIndex', 0);
                        //$("#relatedRelationship").prop('selectedIndex', 0);
                        $("#relatedRelationship").empty();
                        $("#relatedwiwsddl").empty();
                        $("#relatedRelationship").prepend(defaultOpt);
                        $("#relatedwiwsddl").prepend(defaultOpt);
                        $('#WSWIRelInstanceName').val('');
                    } else if (data == "Conflict") {
                        //alert("fail");
                        $('#AlertModal').modal('show');
                        var modal = $('#AlertModal');
                        modal.find('.modal-title').text('Alert!');
                        modal.find('.modal-body p').text('');
                        modal.find('.modal-body p').html('<p>' + WorkitemInstance + "Work item Instance can't be Updated!! </p> <p>\n Problem with Workspace.</p>");
                    }
                    else {
                        $('#AlertModal').modal('show');
                    }
                }
            });
        }
        else {
            //alert("Already relationship there for selected work item.");
            //return false;
            var labelName = $('#relatedRelationship').data('validatelabel');
            var CurrentId = $('#relatedRelationship').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AlreadyWorkitemRelationshipExists + ' </span>');
            validateafields = "ReqField_Invalid";
        }
    });

    $("#relatedwsddl").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('.errmsgrelatedRelationship').addClass('hide');
        //var WSID1 = $("#relatedwsddl option:selected").index();
        var WIID1 = $("#relatedwiwsddl option:selected").index();
        var REL1 = $("#relatedRelationship option:selected").index();
        var selectedIndex = $('#relatedwsddl option:selected').index();
        if (selectedIndex > 0) {
            $("#relatedwiwsddl").empty();
            $("#relatedRelationship").empty();
            defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#relatedwiwsddl, #relatedRelationship").append(defaultOpt);
            $.post('GetwiRelatedWorkspaces', { workspaceID: $("#relatedwsddl").val() }, function (data, status) {

                if (status === 'success') {
                    if (data.length > 0) {
                        $.each(data, function (i, state) {
                            $("#relatedwiwsddl").append('<option value="' + data[i].Value + '">' +
                                data[i].Text + '</option>');
                        });
                    }
                    $('#AddingWIWSRelationship').addClass('Button');
                    $('#AddingWIWSRelationship').removeClass('Button-disable');
                    $('#AddingWIWSRelationship').attr("disabled", false);
                    $('#AddingWIWSRelationship').css("cursor", 'pointer');


                }
                else {
                    ShowModalDialog('Alert!', 'No multiple content type in previous level', false);
                }
            });
        }
        else {
            $('.errmsgrelatedRelationship').addClass('hide');
            $("#relatedwiwsddl").empty();
            $("#relatedRelationship").empty();
            defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#relatedwiwsddl, #relatedRelationship").append(defaultOpt);
            $('#AddingWIWSRelationship').attr("disabled", true);
            $('#AddingWIWSRelationship').css("cursor", 'not-allowed');
            $('#AddingWIWSRelationship').addClass('Button-disable');
            $('#AddingWIWSRelationship').removeClass('Button');
        }
        if (WIID1 === 0 || selectedIndex === 0 || REL1 === 0) {
            $('#relatewswis').attr('disabled', true);
            $('#relatewswis').css("cursor", 'not-allowed');
            $('#relatewswis').addClass('Button-disable');
            $('#relatewswis').removeClass('Button');
        }
        else {
            $('#relatewswis').attr('disabled', false);
            $('#relatewswis').css("cursor", 'pointer');
            $('#relatewswis').addClass('Button');
            $('#relatewswis').removeClass('Button-disable');
        }
    });

    $("#relatedwiwsddl").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('.errmsgrelatedRelationship').addClass('hide');
        var WSID1 = $("#relatedwsddl option:selected").index();
        //var WIID1 = $("#relatedwiwsddl option:selected").index();
        var REL1 = $("#relatedRelationship option:selected").index();
        var selectedIndex = $('#relatedwiwsddl option:selected').index();
        if (selectedIndex > 0) {
            $("#relatedRelationship").empty();
            var defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#relatedRelationship").prepend(defaultOpt);
            $.post('GetwiRelationship', { workitemID: $("#relatedwiwsddl").val() }, function (data, status) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (status === 'success') {
                    if (data.length > 0) {
                        $.each(data, function (i, state) {
                            $("#relatedRelationship").append('<option value="' + data[i].Value + '">' +
                                data[i].Text + '</option>');
                        });
                    }
                }
                else {
                    ShowModalDialog('Alert!', 'No multiple content type in previous level', false);
                }
            });
        }
        else {
            $("#relatedRelationship").empty();
            defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#relatedRelationship").append(defaultOpt);
        }
        if (selectedIndex === 0 || WSID1 === 0 || REL1 === 0 || selectedIndex === -1 || WSID1 === -1 || REL1 === -1) {
            $('#relatewswis').attr('disabled', true);
            $('#relatewswis').css("cursor", 'not-allowed');
            $('#relatewswis').addClass('Button-disable');
            $('#relatewswis').removeClass('Button');
        }
        else {
            $('#relatewswis').attr('disabled', false);
            $('#relatewswis').css("cursor", 'pointer');
            $('#relatewswis').addClass('Button');
            $('#relatewswis').removeClass('Button-disable');
        }
    });

    $("#btnwiresourceallocprevious").click(function () {
        var tab = 'step1';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 1 - Basic information");
    });

    $("#btnrelatedwiprevious").click(function () {
        var tab = 'step2';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 2 - Resource allocation");
    });
    $("#btnEditMetadataGrpsdnext").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var tab = 'step5';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 5 - Product master");
        $('.productMasterInfo').removeClass('hide');
    });
    $("#btnEditwiattachmentsprevious").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var tab = 'step5';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 5 - Product master");
    });
    $("#btnwiproductMasterprevious").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var tab = 'step4';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 4 - Metadata groups");
    });
    $("#btnwiproductMasternext, #btnwiEditbillingRatesprevious").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var tab = 'step6';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 6 - Work item attachments");
    });
    $("#btnEditwiBillingRatesnext").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var tab = 'step7';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 7 - Billing rates");
        if ($(this).hasClass("LoadWIBillingRates")) {
            GetWorkItemBillingRates();
        }
        var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        if (billingratestype === "Inherited") {
            BindRelatedWorkItems();
            GetTasksBillingrates();
        }
    });

    $(document).on('click', '#btnremoveResource', function (e) {
        $(this).closest("tr").find('input').each(function () {
            if ($(this).attr("id") == "rowId") {
                rId = $(this).val();
            }
        });
        e.preventDefault();
        e.stopImmediatePropagation();
        // $('#RemoveWorkflowRel').modal('hide');
        var ResponsibilityId = $("#responID" + rId).val();
        var ResponsibilityName = $("#Respons" + rId).text();
        $("#Resource" + rId).text('');
        var data = workitemEndUser.WorkItemInstance.WorkItemResourcesList;
        var testdata = JSON.stringify(data);
        $.ajax('RemoveWIResource', {
            type: 'POST',  // http method    
            async: false,
            dataType: 'html',
            data: { workitemResourceList: data, responsibility: ResponsibilityId },  // data to submit
            //contentType: "application/json",
            success: function (data, status, xhr) {
                $("#wIRespAdd").addClass('txtcolourforestgreen');
                $("#wIRespAdd").addClass('hide');
                $(".addresourcesrespons").html('');
                $(".addresourcesrespons").html(data);
                CheckMandatoryResponsibility("2");
                var hdnRespStatus = $("#hdnrespStatus").val();
                var hdnRespMsg = $("#hdnrespMessage").val();
                if (hdnRespStatus !== null && hdnRespStatus === "notupcomingtask" && (hdnRespMsg !== null || hdnRespMsg !== "")) {
                    $("#wIRespAdd").removeClass('hide');
                    $("#wIRespAdd").removeClass('txtcolourforestgreen');
                    $("#wIRespAdd").addClass('text-danger');
                    $("#wIRespAdd").html('');
                    $("#wIRespAdd").html(hdnRespMsg);
                    //window.scrollTo(0, 0);
                    setTimeout(function () { $("#wIRespAdd").html(''); }, Web_MsgTimeOutValue);
                }
            }
        });
    });


    $('input[type="checkbox"]').change(function (event) {
        // State has changed to checked/unchecked.
        if ($(this).is(":checked")) {
            $(".bulkcopycount").removeClass('hide');
        }
        else {
            $(".bulkcopycount").addClass('hide');
        }
    });

    $("#btnmdgprevious").click(function () {
        var tab = 'step3';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("  Step 3 - Related work items");
        $("#relatedRelationship").empty();
        $("#relatedwiwsddl").empty();
        $("#relatedRelationship").prepend(defaultOpt);
        $("#relatedwiwsddl").prepend(defaultOpt);
    });

    $("#btnwiattachmentsprevious").click(function () {
        var tab = 'step4';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("  Step 4 - Metadata groups");
    });
    $("#btnbasicinfonext").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var res = true;
        if (res === false) {
            $('#btnworkflownext').attr("disabled", true);
            return false;
        }
        else {
            var tab = 'step2';
            $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            $("#displaytext").html("Step 2 - Resource allocation");
            CheckMandatoryResponsibility("2");
        }
    });

    $("#btnresourceallocnext").click(function () {
        var res = true;
        if (res === false) {

            $('#btnworkflownext').attr("disabled", true);
            return false;
        }
        else {
            var tab = 'step3';
            $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            $("#displaytext").html("Step 3 - Related work items");
            $("#relatedRelationship").empty();
            $("#relatedwiwsddl").empty();
            $("#relatedRelationship").prepend(defaultOpt);
            $("#relatedwiwsddl").prepend(defaultOpt);
        }
    });

    $("#btnrelatedwinext").click(function () {
        var res = true;
        if (res === false) {

            $('#btnworkflownext').attr("disabled", true);
            return false;
        }
        else {
            var tab = 'step4';
            $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            $("#displaytext").html("Step 4 - Metadata groups");
        }
    });

    $("#btnwiAttachmentsnext").click(function () {
        var res = true;
        if (res === false) {

            $('#btnworkflownext').attr("disabled", true);
            return false;
        }
        else {
            var tab = 'step5';
            $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            $("#displaytext").html("Step 5 - Work item attachments");
        }
    });

    $(".LoadWIBillingRates").one("click", function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var tab = 'step6';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 6 - Billing rates");
        if ($(this).hasClass("LoadWIBillingRates")) {
            GetWorkItemBillingRates();
        }
        var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        if (billingratestype === "Inherited") {
            BindRelatedWorkItems();
        }
    });

    function GetWorkItemBillingRates() {
        var params = { workItemTemplateID: $("#ddlwITemplate").val() };
        var PostUrl = WebUrl + "WorkitemEnduser/GetWorkItemBillingrates";
        $.ajax({
            type: 'POST',  // http method
            url: PostUrl,
            data: params,
            async: false,
            success: function (data) {
                $(".addWIbillingRates").html("");
                $(".addWIbillingRates").html(data);
                $("#WIbillingRates").removeClass("LoadWIBillingRates");
                $("#btnwiBillingRatesnext").removeClass("LoadWIBillingRates");
            }
        });
    }

    $("#btnwiBillingRatesnext").click(function () {
        var tab = 'step6';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 6 - Billing rates");
        if ($(this).hasClass("LoadWIBillingRates")) {
            GetWorkItemBillingRates();
        }
        var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        if (billingratestype === "Inherited") {
            BindRelatedWorkItems();
            GetTasksBillingrates();
        }
    });

    $("#btnwibillingRatesprevious").click(function () {
        IsValid = CheckKendoGridInEdit();
        if (IsValid) {
            var tab = 'step5';
            $('.nav-tabs a[href="#' + tab + '"]').tab('show');
            $("#displaytext").html("Step 5 - Work item attachments");
        }
    });

    function BindRelatedWorkItems() {
        if (workitemEndUser !== null && workitemEndUser.WorkItemInstance !== null) {
            if (workitemEndUser.WorkItemInstance.WorkItemBillingRates !== null) {
                if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist !== null) {
                    $("#ddlInheritedWorkItem").empty();
                    $("#ddlInheritedWorkItem").append($("<option></option>").val("").html("--Please select--"));
                    for (wirel = 0; wirel < workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist.length; wirel++) {
                        if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Relationship === "Parent"
                            && workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Status === true) {
                            $("#ddlInheritedWorkItem").append($("<option></option>").val(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ParentWorkItemInstanceID).html(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].RelatedWorkItems));
                            if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ParentWorkItemInstanceID === workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID) {
                                $("#ddlInheritedWorkItem").val(workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID);
                            }
                        } else if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Relationship === "Child"
                            && workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Status === true) {
                            $("#ddlInheritedWorkItem").append($("<option></option>").val(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ChildWorkItemInstanceID).html(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].RelatedWorkItems));
                            if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ChildWorkItemInstanceID === workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID) {
                                $("#ddlInheritedWorkItem").val(workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID);
                            }
                        }
                    }
                }
            }
        }
    }

    function BillingRatesValidations() {
        var IsValid = true;
        var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        if (billingratestype === "Inherited" && $("#ddlInheritedWorkItem").val() === "") {
            IsValid = false;
        } else if ($("#ddlOverrideType").val() === "" || $("#ddlOverrideType").val() === 0) {
            IsValid = false;
        }
        if (!IsValid) {
            $("#btnwiInsatnceSave").prop("disabled", true);
            $("#btnwiInsatnceSave").css('cursor', 'not-allowed');
            $("#btnwiEditSave").prop("disabled", true);
            $("#btnwiEditSave").css('cursor', 'not-allowed');
            //$("#btnwiInsatnceSave").addClass('Button-disable');
            //$("#btnwiInsatnceSave").removeClass('Button');
            $("#btnwiEditSave").addClass('Button-disable');
            $("#btnwiEditSave").removeClass('Button');


        } else {
            $("#btnwiInsatnceSave").prop("disabled", false);
            $("#btnwiInsatnceSave").css('cursor', 'pointer');
            $("#btnwiEditSave").prop("disabled", false);
            $("#btnwiEditSave").css('cursor', 'pointer');
            $("#btnwiEditSave").addClass('Button');
            $("#btnwiEditSave").removeClass('Button-disable');
            //$("#btnwiInsatnceSave").addClass('Button');
            //$("#btnwiInsatnceSave").removeClass('Button-disable');

        }
    }

    function GetTasksBillingrates() {
        var BillingRateType = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        var params = { billingRateType: BillingRateType, workItemInstanceID: $("#ddlInheritedWorkItem").val() };
        $.ajax({
            url: WebURL + "WorkitemEnduser/GetTasksBillingrates",
            type: "POST",
            data: params,
            success: function (data) {
                $(".divWIbillingrates").html("");
                $(".divWIbillingrates").html(data);
            }
        });
    }

    $('.lnkviewWorkitemNotes').click(function (e) {
        e.stopImmediatePropagation();
        e.preventDefault();
        var objectId = $("#WorkitemInstanceID").val().trim();
        var catid = 11;
        var url = WebURL + "Notes/GetNotesByID?objectId=" + objectId + "&categoryId=" + catid;
        window.open(url);
    });

    $(document).on('click', '.ViewRelatedWorkspace', function () {
        var table = $('#WorkitemViewgrid').DataTable();
        var data_row_table = table.row($(this).closest('tr')).data();
        var WorkspaceId = data_row_table.WorkspaceInstanceID;
        var url = "/WorkspaceEnduser/View?WSId=" + WorkspaceId;
        window.location.href = url;
        //localStorage.setItem("HyperLinkWorkFlowName", "ViewWorkFlowDetailsDetails");
    });


    var Mode = this.Mode;
    if (Mode === "EditWorkItem") {
        $('#ddlrelatedwspaceInstance').attr('disabled', 'disabled');
        $('#ddlwITemplate').attr('disabled', 'disabled');
    }
    else if (this.Mode == "Relatedworkitems") {
        var tab = 'step3';
        $('.nav-tabs a[href="#' + tab + '"]').tab('show');
        $("#displaytext").html("Step 3 - Related work items");
        $('#ddlrelatedwspaceInstance').attr('disabled', 'disabled');
        $('#ddlwITemplate').attr('disabled', 'disabled');
    }

    $('#txtWIInstanceName').focusout(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        var WorkItemId;
        if ($(this).hasClass('required')) {
            if ($('#' + CurrentId).val() == "") {
                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            }
            else {
                if ($("#txtWIInstanceID").val() == null || $("#txtWIInstanceID").val() == "") {
                    WorkItemID = 0;
                }
                else {
                    WorkItemID = $("#txtWIInstanceID").val();
                }
                var Isavilable = CheckWorkItemAvailability(value, WorkItemID);
                if (Isavilable) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", value) + '</span>');
                    //$('#' + CurrentId).next().after('<span class="text-danger ' + varErrorClassName + '">' + value + ' Workspace already exists. </span>');
                    // ShowDuplicateWINamePopMessage('Alert', value);
                    $('#btnbasicinfonext').attr("disabled", true);
                    $('#btnbasicinfonext').addClass('Button-disable');
                    $('#btnbasicinfonext').removeClass('Button');
                    $('.resourceAlloc').addClass('disbaleli');
                    $('.relatedWrkItem').addClass('disbaleli');
                    $('.metadatagrps, .productMaster').addClass('disbaleli');
                    $('.attachments').addClass('disbaleli');
                    $('.WIbillingRates').addClass('disbaleli');
                    $('#resourceAllocation').css('cursor', 'default');
                    $('#relatedWrkItem').css('cursor', 'default');
                    $('#metadatagrps, .productMaster').css('cursor', 'default');
                    $('#attachments').css('cursor', 'default');
                    return false;
                }
                else {
                    if (value.length > 100) {
                        $('.errmsg' + CurrentId).remove();
                        varErrorClassName = 'errmsg' + CurrentId;
                        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
                    }
                    else {
                        $('.errmsg' + CurrentId).remove();
                        //$('#btnbasicinfonext').attr("disabled", false);
                        //$('.resourceAlloc').removeClass('disbaleli');
                        //$('.relatedWrkItem').removeClass('disbaleli');
                        //$('.metadatagrps').removeClass('disbaleli');
                    }
                }
            }
        }
        var RelWSselectedIndex = $('#ddlrelatedwspaceInstance option:selected').index();
        var WIselectedIndex = $('#ddlwITemplate option:selected').index();
        var WIInstanceName = $("#txtWIInstanceName").val();
        var selectWorkItemfindiv = $("#ddlwIfindivsion option:selected").val();
        var selectWorkItemSAGE = $("#ddlwISAGEOwner option:selected").val();
        if (WIInstanceName.trim() === "" && RelWSselectedIndex > 0 && WIselectedIndex > 0) {
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('#btnbasicinfonext').removeClass('Button');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
        else if (WIInstanceName.trim() !== "" && RelWSselectedIndex > 0 && WIselectedIndex > 0) {
            $('#btnbasicinfonext').attr("disabled", false);
            $('#btnbasicinfonext').css("cursor", 'pointer');
            $('#btnbasicinfonext').removeClass('Button-disable');
            $('#btnbasicinfonext').addClass('Button');
            $('.resourceAlloc').removeClass('disbaleli');
            $('.relatedWrkItem').removeClass('disbaleli');
            $('.metadatagrps, .productMaster').removeClass('disbaleli');
            $('.attachments').removeClass('disbaleli');
            $('.WIbillingRates').removeClass('disbaleli');
            //$('#btnbasicinfonext').attr("disabled", true);
        }
        if (WIInstanceName.trim() != null && WIInstanceName.trim() != "" && RelWSselectedIndex > 0 && WIselectedIndex > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0) {
            $('#btnbasicinfonext').attr("disabled", false);
            $('#btnbasicinfonext').css("cursor", 'pointer');
            $('#btnbasicinfonext').removeClass('Button-disable');
            $('#btnbasicinfonext').addClass('Button');
            $('.resourceAlloc').removeClass('disbaleli');
            $('.relatedWrkItem').removeClass('disbaleli');
            $('.metadatagrps, .productMaster').removeClass('disbaleli');
            $('.attachments').removeClass('disbaleli');
            $('.WIbillingRates').removeClass('disbaleli');
            $('#resourceAlloc').css('cursor', 'pointer');
            $('#resourceAllocation').css('cursor', 'pointer');
        }
        else if (WIInstanceName.trim() == null || WIInstanceName.trim() == "" || RelWSselectedIndex == 0 || WIselectedIndex == 0 || selectWorkItemfindiv == 0 || selectWorkItemSAGE == 0) {
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
    });

    $('#txtWIDescription').blur(function () {
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (value != "") {
            if (value.length > allowedmaxlength) {

                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
            }
            else {

                $('.errmsg' + CurrentId).remove();
            }
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $("#ddlStatus").on('change', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var selectWorkItem = $("#ddlStatus").val();
        var labelName = $('#ddlStatus').data('validatelabel');
        var CurrentId = $('#ddlStatus').attr('id');
        if (selectWorkItem == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            validateallfields = false;
            return false;
        }
        else if (workitemEndUser.WorkItemInstance.CurrentMode !== "CreateWorkItem") {
            $('.errmsg' + CurrentId).remove();
            var params = { workitemStatusID: selectWorkItem };
            var PostUrl = WebUrl + "WorkitemEnduser/WorkItemInstanceStatusChange";
            $.ajax({
                type: 'POST',
                url: PostUrl,
                data: params,
                async: false,
                success: function (data) {
                    if (data.respStatus !== null) {
                        if (data.respStatus.status === "Fail") {
                            $("#ddlStatus").val(data.workItemStatusID);
                            var message = Web_WorkItemStatusChange.replace("{0}", data.respStatus.message);
                            $('#WorkitemStatusChangeMsg').removeClass('hide');
                            $('#WorkitemStatusChangeMsg').html(message);
                            window.scrollTo(0, 0);
                            setTimeout(function () { $("#WorkitemStatusChangeMsg").html(''); }, Web_MsgTimeOutValue);
                        }
                        else if (data.respStatus.status === "MetadataMandatoryCheckFail") {
                            var workItemStatusID = data.workItemStatusID;
                            $.ajax('ViewMetadataMandatoryDetails', {
                                type: 'POST',  // http method
                                success: function (data, status, xhr) {
                                    $("#ddlStatus").val(workItemStatusID);
                                    $('#MetadataMandatoryDetailsPopup').modal('show');
                                    $('#MetadataMandatoryDetailsbody').html(data);
                                }
                            });
                        }
                        else {
                            $('#WorkitemStatusChangeMsg').addClass('hide');
                            $("#ddlStatus").val(data.workItemStatusID);
                        }
                    } else {
                        $("#ddlStatus").val(data.workItemStatusID);
                    }
                }
            });
        }
    });

    $('#ddlStatus').focusout(function () {
        var WorkitemInstance = $("#ddlStatus").val();
        var labelName = $('#ddlStatus').data('validatelabel');
        var CurrentId = $('#ddlStatus').attr('id');
        if (WorkitemInstance == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $("#ddlrelatedwspaceInstance").on('change', function () {
        var selectWorkItem = $("#ddlrelatedwspaceInstance").val();
        var labelName = $('#ddlrelatedwspaceInstance').data('validatelabel');
        var CurrentId = $('#ddlrelatedwspaceInstance').attr('id');
        if (selectWorkItem == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            validateallfields = false;
            return false;
        } else {
            $('.errmsg' + CurrentId).remove();
        }
        var selectedIndex = $('#ddlrelatedwspaceInstance option:selected').index();
        var WIInstanceName = $("#txtWIInstanceName").val();
        var selectedIndex1 = $('#ddlwITemplate option:selected').index();
        if (selectedIndex > 0 && selectedIndex1 > 0 && WIInstanceName.trim() != "") {
            if (this.Mode === "EditWorkItem") {
                WIIId = $("#txtWIInstanceID").val();
            }
            else {
                WIIId = 0;
            }
            var Isavilable = CheckWorkItemAvailability(WIInstanceName.trim(), WIIId);
            if (Isavilable) {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');
            } else {
                $('#btnbasicinfonext').attr("disabled", false);
                $('#btnbasicinfonext').css("cursor", 'pointer');
                $('#btnbasicinfonext').removeClass('Button-disable');
                $('#btnbasicinfonext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
                $('#resourceAlloc').css('cursor', 'pointer');
                $('#resourceAllocation').css('cursor', 'pointer');
            }
            if (WIInstanceName.trim() === "" && selectedIndex > 0 && selectedIndex1 > 0) {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');
            }
            else if (WIInstanceName.trim() !== "" && selectedIndex > 0 && selectedIndex1 > 0) {
                $('#btnbasicinfonext').attr("disabled", false);
                $('#btnbasicinfonext').css("cursor", 'pointer');
                $('#btnbasicinfonext').removeClass('Button-disable');
                $('#btnbasicinfonext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
                //$('#btnbasicinfonext').attr("disabled", true);
            }
        }

    });

    $('#ddlrelatedwspaceInstance').focusout(function () {
        var WorkitemInstance = $("#ddlrelatedwspaceInstance").val();
        var labelName = $('#ddlrelatedwspaceInstance').data('validatelabel');
        var CurrentId = $('#ddlrelatedwspaceInstance').attr('id');
        if (WorkitemInstance == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $("#ddlwITemplate").on('change', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var selectWorkItem = $("#ddlwITemplate").val();
        var labelName = $('#ddlwITemplate').data('validatelabel');
        var CurrentId = $('#ddlwITemplate').attr('id');

        if (selectWorkItem === "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            validateallfields = false;
            return false;
        } else {
            $('.errmsg' + CurrentId).remove();
            if (workitemEndUser.WorkItemInstance.CurrentMode === "CreateWorkItem") {
                var IsExists = CheckWorkItemTemplateConfigurationsExists();
                if (IsExists) {
                    $("#WITemplateChangeAlertModal").show();
                    return false;
                } else {
                    GetWorkitemTemplateResources(selectWorkItem);
                    GetWorkitemTemplateMetadataGroups(selectWorkItem);
                    RemoveWorkItemTemplateConfigurations();
                    $("#WIbillingRates").addClass("LoadWIBillingRates");
                    $("#btnwiBillingRatesnext").addClass("LoadWIBillingRates");
                }
            }
        }

        var selectedIndex = $('#ddlrelatedwspaceInstance option:selected').index();
        var WIInstanceName = $("#txtWIInstanceName").val();
        var selectedIndex1 = $('#ddlwITemplate option:selected').index();
        if (selectedIndex > 0 && selectedIndex1 > 0 && WIInstanceName.trim() !== "") {
            var selectedIndexfin = $('#ddlwIfindivsion option:selected').index();
            if (selectedIndex > 0 && selectedIndex1 > 0 && selectedIndexfin > 0 && WIInstanceName.trim() !== "") {
                if (this.Mode === "EditWorkItem") {
                    WIIId = $("#txtWIInstanceID").val();
                }
                else {
                    WIIId = 0;
                }
                var Isavilable = CheckWorkItemAvailability(WIInstanceName.trim(), WIIId);
                if (Isavilable) {
                    $('#btnbasicinfonext').attr("disabled", true);
                    $('#btnbasicinfonext').css("cursor", 'not-allowed');
                    $('#btnbasicinfonext').removeClass('Button');
                    $('#btnbasicinfonext').addClass('Button-disable');
                    $('.resourceAlloc').addClass('disbaleli');
                    $('.relatedWrkItem').addClass('disbaleli');
                    $('.metadatagrps').addClass('disbaleli');
                    $('.attachments').addClass('disbaleli');
                    $('.WIbillingRates').addClass('disbaleli');
                    $('#resourceAllocation').css('cursor', 'default');
                    $('#relatedWrkItem').css('cursor', 'default');
                    $('#metadatagrps').css('cursor', 'default');
                    $('#attachments').css('cursor', 'default');
                }
                else {
                    $('#btnbasicinfonext').attr("disabled", false);
                    $('#btnbasicinfonext').css("cursor", 'pointer');
                    $('#btnbasicinfonext').removeClass('Button-disable');
                    $('#btnbasicinfonext').addClass('Button');
                    $('.resourceAlloc').removeClass('disbaleli');
                    $('.relatedWrkItem').removeClass('disbaleli');
                    $('.metadatagrps').removeClass('disbaleli');
                    $('.attachments').removeClass('disbaleli');
                    $('.WIbillingRates').removeClass('disbaleli');
                    $('#resourceAlloc').css('cursor', 'pointer');
                    $('#resourceAllocation').css('cursor', 'pointer');
                }
                if (WIInstanceName.trim() === "" && selectedIndex > 0 && selectedIndex1 > 0 && selectedIndexfin > 0) {
                    $('#btnbasicinfonext').attr("disabled", true);
                    $('#btnbasicinfonext').css("cursor", 'not-allowed');
                    $('#btnbasicinfonext').removeClass('Button');
                    $('#btnbasicinfonext').addClass('Button-disable');
                    $('.resourceAlloc').addClass('disbaleli');
                    $('.relatedWrkItem').addClass('disbaleli');
                    $('.metadatagrps').addClass('disbaleli');
                    $('.WIbillingRates').addClass('disbaleli');
                    $('#resourceAllocation').css('cursor', 'default');
                    $('#relatedWrkItem').css('cursor', 'default');
                    $('#metadatagrps').css('cursor', 'default');
                }
                else if (WIInstanceName.trim() !== "" && selectedIndex > 0 && selectedIndex1 > 0 && selectedIndexfin > 0) {
                    $('#btnbasicinfonext').attr("disabled", false);
                    $('#btnbasicinfonext').css("cursor", 'pointer');
                    $('#btnbasicinfonext').removeClass('Button-disable');
                    $('#btnbasicinfonext').addClass('Button');
                    $('.resourceAlloc').removeClass('disbaleli');
                    $('.relatedWrkItem').removeClass('disbaleli');
                    $('.metadatagrps').removeClass('disbaleli');
                    $('.WIbillingRates').removeClass('disbaleli');
                    $('#btnbasicinfonext').attr("disabled", true);
                    $('#btnbasicinfonext').css("cursor", 'not-allowed');
                    $('#btnbasicinfonext').removeClass('Button');
                    $('#btnbasicinfonext').addClass('Button-disable');
                }
                else if (WIInstanceName.trim() !== "" && selectedIndex > 0 && selectedIndex1 > 0 && !selectedIndexfin > 0) {
                    $('#btnbasicinfonext').attr("disabled", true);
                    $('#btnbasicinfonext').css("cursor", 'not-allowed');
                    $('#btnbasicinfonext').removeClass('Button');
                    $('#btnbasicinfonext').addClass('Button-disable');
                    $('.resourceAlloc').addClass('disbaleli');
                    $('.relatedWrkItem').addClass('disbaleli');
                    $('.metadatagrps').addClass('disbaleli');
                    $('.WIbillingRates').addClass('disbaleli');
                    $('#resourceAllocation').css('cursor', 'default');
                    $('#relatedWrkItem').css('cursor', 'default');
                    $('#metadatagrps').css('cursor', 'default');
                }
            }
            else {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps').css('cursor', 'default');
            }
        }
    });

    $("#btnWITemplateChangeYes").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $("#WITemplateChangeAlertModal").hide();
        var selectWorkItem = $("#ddlwITemplate").val();
        GetWorkitemTemplateResources(selectWorkItem);
        GetWorkitemTemplateMetadataGroups(selectWorkItem);
        RemoveWorkItemTemplateConfigurations();
        $("#WIbillingRates").addClass("LoadWIBillingRates");
        $("#btnwiBillingRatesnext").addClass("LoadWIBillingRates");
    });

    $("#btnWITemplateChangeNo").click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (workitemEndUser !== null && workitemEndUser.WorkItemInstance !== null) {
            $("#ddlwITemplate").val(workitemEndUser.WorkItemInstance.WorkItemTemplateID);
        }
        $("#WITemplateChangeAlertModal").hide();
    });

    function CheckWorkItemTemplateConfigurationsExists() {
        var IsExists = false;
        $.ajax('CheckWorkItemTemplateConfigurationsExists', {
            type: 'GET',  // http method                                        
            async: false,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                IsExists = data;
            }
        });
        return IsExists;
    }

    //$("#ddlwIfindivsion").on('change', function (e)
    $(document).on('change', '#ddlwIfindivsion', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var RelWSselectedIndex = $("#ddlrelatedwspaceInstance option:selected").val();
        var selectWorkItem = $("#ddlwITemplate option:selected").val();
        var selectWorkItemfindiv = $("#ddlwIfindivsion option:selected").val();
        var selectWorkItemSAGE = $("#ddlwISAGEOwner option:selected").val();
        var labelName = $('#ddlwIfindivsion').data('validatelabel');
        var CurrentId = $('#ddlwIfindivsion').attr('id');
        var WIInstanceName = $("#txtWIInstanceName").val();
        if (selectWorkItemfindiv == "") {
            //$('.errmsg' + CurrentId).remove();
            //varErrorClassName = 'errmsg ' + CurrentId;
            //$('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            //validateallfields = false;
            //return false;
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
        if (RelWSselectedIndex > 0 && selectWorkItem > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0 && WIInstanceName.trim() != "") {
            if (this.Mode === "EditWorkItem") {
                WIIId = $("#txtWIInstanceID").val();
            }
            else {
                WIIId = 0;
            }
            var Isavilable = CheckWorkItemAvailability(WIInstanceName.trim(), WIIId);
            if (Isavilable) {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps, .productMaster').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps, .productMaster').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');
            } else if (RelWSselectedIndex > 0 && selectWorkItem > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0) {
                $('#btnbasicinfonext').attr("disabled", false);
                $('#btnbasicinfonext').css("cursor", 'pointer');
                $('#btnbasicinfonext').removeClass('Button-disable');
                $('#btnbasicinfonext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps, .productMaster').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
                $('#resourceAlloc').css('cursor', 'pointer');
                $('#resourceAllocation').css('cursor', 'pointer');
            }
            if (WIInstanceName.trim() != null && WIInstanceName.trim() != "" && RelWSselectedIndex > 0 && selectWorkItem > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0) {
                $('#btnbasicinfonext').attr("disabled", false);
                $('#btnbasicinfonext').css("cursor", 'pointer');
                $('#btnbasicinfonext').removeClass('Button-disable');
                $('#btnbasicinfonext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps, .productMaster').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
                $('#resourceAlloc').css('cursor', 'pointer');
                $('#resourceAllocation').css('cursor', 'pointer');
            }
            else if (WIInstanceName.trim() == null || WIInstanceName.trim() == "" || RelWSselectedIndex == 0 || selectWorkItem == 0 || selectWorkItemfindiv == 0 || selectWorkItemSAGE == 0) {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps, .productMaster').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps, .productMaster').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');
            }
        }
        else {
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
        }
        CheckMandatoryResponsibility("");           // BFLY-3513 (VSTS-2549)
    });

    $("#ddlwISAGEOwner").on('change', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var RelWSselectedIndex = $("#ddlrelatedwspaceInstance option:selected").val();
        var selectWorkItem = $("#ddlwITemplate option:selected").val();
        var selectWorkItemfindiv = $("#ddlwIfindivsion option:selected").val();
        var selectWorkItemSAGE = $("#ddlwISAGEOwner option:selected").val();
        var WIInstanceName = $("#txtWIInstanceName").val();
        var labelName = $('#ddlwISAGEOwner').data('validatelabel');
        var CurrentId = $('#ddlwISAGEOwner').attr('id');
        if (selectWorkItemSAGE == "") {
            //$('.errmsg' + CurrentId).remove();
            //varErrorClassName = 'errmsg ' + CurrentId;
            //$('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            //validateallfields = false;          
            //return false;
        } else {
            $('.errmsg' + CurrentId).remove();
        }
        if (RelWSselectedIndex > 0 && selectWorkItem > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0 && WIInstanceName.trim() != "") {
            if ($("#txtWIInstanceID").val() != null && $("#txtWIInstanceID").val() != 0) {
                WIIId = $("#txtWIInstanceID").val();
            }
            else {
                WIIId = 0;
            }
            var Isavilable = CheckWorkItemAvailability(WIInstanceName.trim(), WIIId);
            if (Isavilable) {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps, .productMaster').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps, .productMaster').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');
            } else {
                $('#btnbasicinfonext').attr("disabled", false);
                $('#btnbasicinfonext').css("cursor", 'pointer');
                $('#btnbasicinfonext').removeClass('Button-disable');
                $('#btnbasicinfonext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps, .productMaster').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
                $('#resourceAlloc').css('cursor', 'pointer');
                $('#resourceAllocation').css('cursor', 'pointer');
            }
            if (WIInstanceName.trim() != null && WIInstanceName.trim() != "" && RelWSselectedIndex > 0 && selectWorkItem > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0) {
                $('#btnbasicinfonext').attr("disabled", false);
                $('#btnbasicinfonext').css("cursor", 'pointer');
                $('#btnbasicinfonext').removeClass('Button-disable');
                $('#btnbasicinfonext').addClass('Button');
                $('.resourceAlloc').removeClass('disbaleli');
                $('.relatedWrkItem').removeClass('disbaleli');
                $('.metadatagrps, .productMaster').removeClass('disbaleli');
                $('.attachments').removeClass('disbaleli');
                $('.WIbillingRates').removeClass('disbaleli');
                $('#resourceAlloc').css('cursor', 'pointer');
                $('#resourceAllocation').css('cursor', 'pointer');
            }
            else if (WIInstanceName.trim() == null || WIInstanceName.trim() == "" || RelWSselectedIndex == 0 || selectWorkItem == 0 || selectWorkItemfindiv == 0 || selectWorkItemSAGE == 0) {
                $('#btnbasicinfonext').attr("disabled", true);
                $('#btnbasicinfonext').css("cursor", 'not-allowed');
                $('#btnbasicinfonext').removeClass('Button');
                $('#btnbasicinfonext').addClass('Button-disable');
                $('.resourceAlloc').addClass('disbaleli');
                $('.relatedWrkItem').addClass('disbaleli');
                $('.metadatagrps, .productMaster').addClass('disbaleli');
                $('.attachments').addClass('disbaleli');
                $('.WIbillingRates').addClass('disbaleli');
                $('#resourceAllocation').css('cursor', 'default');
                $('#relatedWrkItem').css('cursor', 'default');
                $('#metadatagrps, .productMaster').css('cursor', 'default');
                $('#attachments').css('cursor', 'default');
            }
        }
        else {
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
        }
        CheckMandatoryResponsibility("");           // BFLY-3513 (VSTS-2549)
    });

    function GetWorkitemTemplateResources(WorkItemTemplateID) {
        var resopnseobj = false;
        var data;
        var params = { workitemTemplateID: WorkItemTemplateID };
        $.ajax({
            type: 'Get',
            url: "GetWorkitemTemplateResources",
            data: params,
            async: false,
            success: function (data, status, xhr) {
                $(".addresourcesrespons").html('');
                $(".addresourcesrespons").html(data);
                //  resopnseobj = response;

                CheckMandatoryResponsibility("");                 //  BFLY-3513 (VSTS-2549)
            }
        });
        return resopnseobj;
    }
    function GetWorkitemTemplateMetadataGroups(WorkItemTemplateID) {
        var resopnseobj = false;
        var data;
        var params = { workitemTemplateID: WorkItemTemplateID };
        $.ajax({
            type: 'Get',
            url: "GetWorkitemMetadataGroups",
            data: params,
            async: false,
            success: function (data, status, xhr) {
                $(".Metadatatab").html('');
                $(".Metadatatab").html(data);
                //  resopnseobj = response;
            }
        });
        return resopnseobj;
    }
    function RemoveWorkItemTemplateConfigurations() {
        var resopnseobj = false;
        $.ajax({
            type: 'GET',
            url: "RemoveWorkItemTemplateConfigurations",
            async: false,
            success: function (data, status, xhr) {
                $(".relatedworkItems").html('');
                $(".relatedworkItems").html(data);
            }
        });
        return resopnseobj;
    }
    $('#ddlwITemplate').focusout(function () {
        var WorkitemInstance = $("#ddlwITemplate").val();
        var labelName = $('#ddlwITemplate').data('validatelabel');
        var CurrentId = $('#ddlwITemplate').attr('id');
        if (WorkitemInstance == -1 || WorkitemInstance == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').addClass("Button");
            $('#btnbasicinfonext').removeClass("Button-disable");
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $('#ddlwIfindivsion').focusout(function () {
        var WorkitemFinanceDiv = $("#ddlwIfindivsion").val();
        var labelName = $('#ddlwIfindivsion').data('validatelabel');
        var CurrentId = $('#ddlwIfindivsion').attr('id');
        if (WorkitemFinanceDiv === -1 || WorkitemFinanceDiv === "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $('#ddlwISAGEOwner').focusout(function () {
        var WorkitemSageOwner = $("#ddlwISAGEOwner").val();
        var labelName = $('#ddlwISAGEOwner').data('validatelabel');
        var CurrentId = $('#ddlwISAGEOwner').attr('id');
        if (WorkitemSageOwner === -1 || WorkitemSageOwner === "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
        else {
            $('.errmsg' + CurrentId).remove();
        }
    });

    $('#addNotes').blur(function () {
        var labelName = $(this).data('validatelabel');
        var CurrentId = $(this).attr('id');
        var allowedmaxlength = $(this).data('maxlength');
        var value = $("#" + CurrentId).val().trim();
        if (value != "") {
            if (value.length > 300) {

                $('.errmsg' + CurrentId).remove();
                varErrorClassName = 'errmsg' + CurrentId;
                $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">Allows maximum ' + allowedmaxlength + ' characters.');
            }
            else {
                $('.notesTagUsers-wi').removeClass('hide');
                $('.errmsg' + CurrentId).remove();
            }
        }
        else {
            $('.notesTagUsers-wi').addClass('hide');
            $('.errmsg' + CurrentId).remove();
        }
    });
    //$(document).on('keypress', '#txtWIDescription, #txtWIInstanceName', function (e) {
    //    //$('.NameValidatorWorkItemInst').keypress(function (e) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var keyCode = e.which;
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var value = $("#" + CurrentId).val().trim();
    //    if ((keyCode < 48 || keyCode > 57)
    //        && (keyCode < 65 || keyCode > 90)
    //        && (keyCode < 97 || keyCode > 122)
    //        && (keyCode != 0)
    //        && (keyCode != 8)
    //        && (keyCode != 32)
    //        && (keyCode != 45)) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else if (value.length > allowedmaxlength - 1 && keyCode != 8 && keyCode != 0) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else {

    //        $('.errmsg' + CurrentId).remove();
    //    }
    //});

    //$('#txtWIInstanceName, #txtWIDescription').on('paste', function (event) {
    //    if (event.originalEvent.clipboardData.getData('Text').match(/[^a-zA-Z0-9- ]/)) {
    //        event.preventDefault();
    //        var labelName = $(this).data('validatelabel');
    //        var CurrentId = $(this).attr('id');
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //        event.preventDefault();
    //    }
    //});

    //$('#txtWIInstanceName').on("paste", function (e) {
    //    e.preventDefault();
    //    e.stopImmediatePropagation();
    //    $(this).val(function (i, v) {
    //        return v.replace(/[^a-zA-Z0-9 ]/g, '');
    //    });
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    varErrorClassName = 'errmsg' + CurrentId;
    //    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //    e.preventDefault();
    //});
    //$('#txtWIDescription').on("paste", function (e) {
    //    e.preventDefault();
    //    e.stopImmediatePropagation();
    //    $(this).val(function (i, v) {
    //        return v.replace(/[^a-zA-Z0-9 ]/g, '');
    //    });
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    varErrorClassName = 'errmsg' + CurrentId;
    //    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_OnlyAlphaNumeric.replace("{0}", labelName) + '</span>');
    //    e.preventDefault();
    //});

    //$('.MaxLengthWIInstValidation').keypress(function (e) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var keyCode = e.which;
    //    var value = $("#" + CurrentId).val();
    //    if (value.length > allowedmaxlength - 1 && keyCode != 8 && keyCode != 0) {
    //        $('.errmsg' + CurrentId).remove();
    //        varErrorClassName = 'errmsg' + CurrentId;
    //        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength) + ' ');
    //        e.preventDefault();
    //        return false;
    //    }
    //    else {

    //        $('.errmsg' + CurrentId).remove();

    //    }
    //});

    //$(".MaxLengthWIInstValidation").on("keyup", function (event) {
    //    var labelName = $(this).data('validatelabel');
    //    var CurrentId = $(this).attr('id');
    //    var allowedmaxlength = $(this).data('maxlength');
    //    var value = $("#" + CurrentId).val();
    //    var code = event.keyCode || event.which;
    //    if (code == 8 && value.length == 0) {
    //        $('.errmsg' + CurrentId).remove();
    //    }
    //    if (code == 8 && value.length < allowedmaxlength) {
    //        $('.errmsg' + CurrentId).remove();
    //    }
    //});

    $("#relatedRelationship").on('change', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var selectWorkItem = $("#relatedRelationship").val();
        var labelName = $('#relatedRelationship').data('validatelabel');
        var CurrentId = $('#relatedRelationship').attr('id');
        if (selectWorkItem == "") {
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).next('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
            validateallfields = false;
            return false;
        } else {
            $('.errmsg' + CurrentId).remove();
        }
        var WSID1 = $("#relatedwsddl option:selected").index();
        var WIID1 = $("#relatedwiwsddl option:selected").index();
        var REL1 = $("#relatedRelationship option:selected").index();
        if (WSID1 !== 0 && WIID1 !== 0 && REL1 !== 0) {
            $('#relatewswis').attr('disabled', false);
            $('#relatewswis').css("cursor", 'pointer');
            $('#relatewswis').addClass('Button');
            $('#relatewswis').removeClass('Button-disable');
        }
        else {
            $('#relatewswis').attr('disabled', true);
            $('#relatewswis').css("cursor", 'not-allowed');
            $('#relatewswis').addClass('Button-disable');
            $('#relatewswis').removeClass('Button');
        }
    });


    WebURL = this.WebURL;
    $('.WorkItemClose').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#UpdateWIModal').modal('hide');
        RedirectUrl = WebURL + 'WorkflowEnduser';
        window.location.replace(RedirectUrl);
    });

    $(document).on('click', '.WorkitemCancel', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $.ajax('DeleteAllAttachmentOnCancel', {
            type: 'POST',
            async: false,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data, status, xhr) {
                RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=WorkitemInfo';
                window.location.replace(RedirectUrl);
            },
            error: function () {
                RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=WorkitemInfo';
                window.location.replace(RedirectUrl);
            }
        });
    });

    $('#btnBack').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=WorkitemInfo';
        window.location.replace(RedirectUrl);
    });
    $(document).on('click', '.Resourcelnkviewhistory', function (e) {
        $(".divResources").removeClass('hide');
    });
    $(document).on('click', '.editviewWorkitem', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var WorkiteminstanceID = $("#WorkItemInstanceID").val();
        var url = "/WorkitemEnduser/EditWorkitem?workitemID=" + WorkiteminstanceID;
        window.location.href = url;
    });
    $(document).on('click', '.cancelviewworkitem', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var RedirectStatus = localStorage.getItem("WorkitemView");
        var MTRedirectStatus = localStorage.getItem("MTWorkitemView");
        $('#UpdateWIModal').modal('hide');
        if (RedirectStatus == "WorkitemView") {
            localStorage.removeItem("WorkitemView");
            localStorage.setItem("WorkitemViewRet", true);
            RedirectUrl = WebURL + 'Dashboard/Index';
        }
        else if (MTRedirectStatus == "MTWorkitemView") {
            localStorage.removeItem("MTWorkitemView");
            RedirectUrl = WebURL + 'Dashboard/Index';
        }
        else {
            RedirectUrl = WebURL + 'WorkflowEnduser?ActiveTab=WorkitemInfo';
        }
        window.location.replace(RedirectUrl);
    });

    $(document).on('click', '#resourceAllocation', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var RelWSselectedIndex = $("#ddlrelatedwspaceInstance option:selected").val();
        var selectWorkItem = $("#ddlwITemplate option:selected").val();
        var selectWorkItemfindiv = $("#ddlwIfindivsion option:selected").val();
        var selectWorkItemSAGE = $("#ddlwISAGEOwner option:selected").val();
        var labelName = $('#ddlwIfindivsion').data('validatelabel');
        var CurrentId = $('#ddlwIfindivsion').attr('id');
        var WIInstanceName = $("#txtWIInstanceName").val();
        if (WIInstanceName.trim() != null && WIInstanceName.trim() != "" && RelWSselectedIndex > 0 && selectWorkItem > 0 && selectWorkItemfindiv > 0 && selectWorkItemSAGE > 0) {
            $('#btnbasicinfonext').attr("disabled", false);
            $('#btnbasicinfonext').css("cursor", 'pointer');
            $('#btnbasicinfonext').removeClass('Button-disable');
            $('#btnbasicinfonext').addClass('Button');
            $('.resourceAlloc').removeClass('disbaleli');
            $('.relatedWrkItem').removeClass('disbaleli');
            $('.metadatagrps, .productMaster').removeClass('disbaleli');
            $('.attachments').removeClass('disbaleli');
            $('.WIbillingRates').removeClass('disbaleli');
            $('#resourceAlloc').css('cursor', 'pointer');
            $('#resourceAllocation').css('cursor', 'pointer');
        }
        else if (WIInstanceName.trim() == null || WIInstanceName.trim() == "" || RelWSselectedIndex == 0 || selectWorkItem == 0 || selectWorkItemfindiv == 0 || selectWorkItemSAGE == 0) {
            $('#btnbasicinfonext').attr("disabled", true);
            $('#btnbasicinfonext').css("cursor", 'not-allowed');
            $('#btnbasicinfonext').removeClass('Button');
            $('#btnbasicinfonext').addClass('Button-disable');
            $('.resourceAlloc').addClass('disbaleli');
            $('.relatedWrkItem').addClass('disbaleli');
            $('.metadatagrps, .productMaster').addClass('disbaleli');
            $('.attachments').addClass('disbaleli');
            $('.WIbillingRates').addClass('disbaleli');
            $('#resourceAllocation').css('cursor', 'default');
            $('#relatedWrkItem').css('cursor', 'default');
            $('#metadatagrps, .productMaster').css('cursor', 'default');
            $('#attachments').css('cursor', 'default');
        }
    });
    $("#DrpkpiMetrics").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var metricsID = $("#DrpkpiMetrics").val();
        var workItemID;
        var params = { metricsID: $("#DrpkpiMetrics").val(), workItemID: $("#WorkItemInstanceID").val() };
        if (metricsID !== "" && metricsID !== "-1") {
            $.ajax('GetKpiMetricsList', {
                type: 'POST',  // http method
                data: params,
                async: false,
                dataType: 'json',
                success: function (data, status, xhr) {
                    if (data.status === "Success") {
                        var KpiMetricsList = data.workitemEndUser.KpiMetricCalculationList;
                        if (KpiMetricsList !== null) {
                            //$('#tblKpiMetrics').DataTable().column(0).visible(true);
                            $('#tblKpiMetrics').DataTable().column(1).visible(true);
                            $('#tblKpiMetrics').DataTable().column(2).visible(true);
                            $('#tblKpiMetrics').DataTable().column(3).visible(true);
                            $('#tblKpiMetrics').DataTable().column(4).visible(true);
                            $('#tblKpiMetrics').DataTable().column(5).visible(true);
                            $('#KpiMetricsTblDiv').removeClass('hide');
                            $('#tblKpiMetrics tfoot th').each(function () {
                                var val = $(this).data('searchable');
                                if ($(this).data('searchable') === true) {
                                    var title = $(this).text();
                                    var id = $(this).attr('id');
                                    var SearchId = id + 'SearchField';
                                    var InputSearchbox;
                                    if (id === "txtStartDate" || id === "txtEndDate") {
                                        InputSearchbox = '<div class="form-group has-feedback"><input type="text" placeholder="dd-mmm-yyyy" id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                                    }
                                    else {
                                        InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                                    }
                                    $(this).html(InputSearchbox);
                                }
                            });
                            $('#tblKpiMetrics tfoot th').show();
                            var table = $('#tblKpiMetrics').DataTable({
                                "stripeClasses": [],
                                "destroy": true,
                                "processing": false, // for show progress bar
                                "orderMulti": false,// for disable multiple column at once
                                "filter": false,
                                "searching": false,
                                "order": [1, "asc"],
                                // this is for disable filter (search box)
                                "language": {
                                    "emptyTable": function (KpiMetricsList) {
                                        if ((recordsearch === "load" && KpiMetricsList === null) || (recordsearch === "load" && KpiMetricsList === "")) {
                                            return Web_NoKpiMetricsRecordsExists;
                                        }
                                        else {
                                            return Web_NoKpiMetricsRecordsExists;
                                        }
                                    }
                                },
                                "data": KpiMetricsList,
                                "columns": [

                                    { "data": "TaskID", "name": "ID", "visible": false },
                                    { "data": "TaskName", "name": "Task Name", "className": "col-md-2 minwidth tblTaskName", "orderable": true },
                                    { "data": "WorkflowName", "name": "Workflow Name", "className": "col-md-2 text-center tblWorkflowName", "orderable": true },
                                    { "data": "StartDate", "name": "Start Date", "orderable": true, "className": "col-md-2 text-center", "type": "date" },
                                    { "data": "EndDate", "name": "End Date", "orderable": true, "className": "col-md-2 text-center", "type": "date" },
                                    { "data": "Status", "name": "Status", "className": "col-md-2 text-center", "orderable": true },
                                    { "data": "TimeSpent", "name": "Time Spent", "className": "col-md-2 text-center", "orderable": true }
                                ],
                                columnDefs: [
                                    {
                                        "targets": [1],
                                        render: function (data, type, row) {
                                            return '<span style="cursor: pointer;" class="ViewWorkitemTask linkcolour">' + data + '</span>';
                                        }
                                    },
                                    {
                                        "targets": [2],
                                        render: function (data, type, row) {
                                            return '<span style="cursor: pointer;" class="ViewWorkitemWorkflow linkcolour">' + data + '</span>';
                                        }
                                    }
                                ],
                                "fnDrawCallback": function (oSettings) {
                                    var id = data.workitemEndUser.SelectedKpiMetricID;
                                    var SelectedKpiMetricText = data.workitemEndUser.SelectedKpiMetricText;
                                    var head_item;
                                    //Time per Task
                                    if (SelectedKpiMetricText === "TimePerTask") {
                                        $('#tblKpiMetrics').DataTable().column(2).visible(false);
                                        head_item = $('#tblKpiMetrics').DataTable().columns(4).header();
                                        $(head_item).html(Web_Lbl_Tbl_KpiMetrics_EndDate);
                                        head_item = $('#tblKpiMetrics').DataTable().columns(6).header();
                                        $(head_item).html(Web_Lbl_Tbl_KpiMetrics_TimeSpent);
                                        $('.tblWorkflowName').removeClass('sorting_asc');
                                        $('.tblTaskName').addClass('sorting_asc');
                                    }
                                    //Time to completion
                                    else if (SelectedKpiMetricText === "TimeToCompletion") {
                                        $('#tblKpiMetrics').DataTable().column(1).visible(false);
                                        head_item = $('#tblKpiMetrics').DataTable().columns(4).header();
                                        $(head_item).html(Web_Lbl_Tbl_KpiMetrics_CompleteDate);
                                        head_item = $('#tblKpiMetrics').DataTable().columns(6).header();
                                        $(head_item).html(Web_Lbl_Tbl_KpiMetrics_TimeSpent);
                                        $('.tblWorkflowName').addClass('sorting_asc');
                                        $('.tblTaskName').removeClass('sorting_asc');
                                    }
                                    //Number of correction rounds
                                    else if (SelectedKpiMetricText === "CorrectionRounds") {
                                        $('#tblKpiMetrics').DataTable().column(3).visible(false);
                                        $('#tblKpiMetrics').DataTable().column(4).visible(false);
                                        $('#tblKpiMetrics').DataTable().column(5).visible(false);
                                        head_item = $('#tblKpiMetrics').DataTable().columns(6).header();
                                        $(head_item).html(Web_Lbl_Tbl_KpiMetrics_CorrectionRound);
                                        $('.tblWorkflowName').removeClass('sorting_asc');
                                        $('.tblTaskName').addClass('sorting_asc');
                                    }
                                }
                            });
                            var isFromDashboard = $('#isFromDashboard').val();
                            if (ViewTaskResourceAllocation === true) {
                                $('.ViewWorkitemWorkflow, .ViewWorkitemTask').addClass('linkcolour');
                                $('.ViewWorkitemWorkflow, .ViewWorkitemTask').css("pointer-events", "auto");
                            }
                            else if (isFromDashboard === "True") {
                                $('.ViewWorkitemWorkflow, .ViewWorkitemTask').removeClass('linkcolour');
                                $('.ViewWorkitemWorkflow, .ViewWorkitemTask').css("pointer-events", "none");
                            }

                        }
                        else {
                            $('#KpiMetricsTblDiv').removeClass('hide');
                            $('#tblKpiMetrics').DataTable().clear();
                            $('#tblKpiMetrics').DataTable().draw();
                            var id = $("#DrpkpiMetrics").val();
                            var KpiSelectedText = $("#DrpkpiMetrics option:selected").text();
                            var head_item;
                            //Time per Task
                            if (KpiSelectedText === "Time per task") {
                                $('#tblKpiMetrics').DataTable().destroy();

                                $('#tblKpiMetrics').DataTable().column(2).visible(false);
                                $('#tblKpiMetrics').DataTable().column(0).visible(false);
                                $('#tblKpiMetrics').DataTable().column(1).visible(true);
                                $('#tblKpiMetrics').DataTable().column(3).visible(true);
                                $('#tblKpiMetrics').DataTable().column(4).visible(true);
                                $('#tblKpiMetrics').DataTable().column(5).visible(true);
                                $('#tblKpiMetrics').DataTable().column(6).visible(true);
                                head_item = $('#tblKpiMetrics').DataTable().columns(4).header();
                                $(head_item).html(Web_Lbl_Tbl_KpiMetrics_EndDate);
                                head_item = $('#tblKpiMetrics').DataTable().columns(6).header();
                                $(head_item).html(Web_Lbl_Tbl_KpiMetrics_TimeSpent);
                            }
                            //Time to completion
                            else if (KpiSelectedText === "Time to completion") {
                                $('#tblKpiMetrics').DataTable().destroy();

                                $('#tblKpiMetrics').DataTable().column(1).visible(false);
                                $('#tblKpiMetrics').DataTable().column(0).visible(false);
                                $('#tblKpiMetrics').DataTable().column(2).visible(true);
                                $('#tblKpiMetrics').DataTable().column(3).visible(true);
                                $('#tblKpiMetrics').DataTable().column(4).visible(true);
                                $('#tblKpiMetrics').DataTable().column(5).visible(true);
                                $('#tblKpiMetrics').DataTable().column(6).visible(true);
                                head_item = $('#tblKpiMetrics').DataTable().columns(4).header();
                                $(head_item).html(Web_Lbl_Tbl_KpiMetrics_CompleteDate);
                                head_item = $('#tblKpiMetrics').DataTable().columns(6).header();
                                $(head_item).html(Web_Lbl_Tbl_KpiMetrics_TimeSpent);
                            }
                            //Number of correction rounds
                            else if (KpiSelectedText === "Number of correction rounds") {
                                $('#tblKpiMetrics').DataTable().destroy();

                                $('#tblKpiMetrics').DataTable().column(3).visible(false);
                                $('#tblKpiMetrics').DataTable().column(4).visible(false);
                                $('#tblKpiMetrics').DataTable().column(0).visible(false);
                                $('#tblKpiMetrics').DataTable().column(5).visible(false);
                                $('#tblKpiMetrics').DataTable().column(1).visible(true);
                                $('#tblKpiMetrics').DataTable().column(2).visible(true);
                                $('#tblKpiMetrics').DataTable().column(6).visible(true);
                                head_item = $('#tblKpiMetrics').DataTable().columns(6).header();
                                $(head_item).html(Web_Lbl_Tbl_KpiMetrics_CorrectionRound);
                            }
                            $('#tblKpiMetrics tfoot th').hide();
                            $('#tblKpiMetrics_filter').addClass('hide');
                            $('#tblKpiMetrics tr td.dataTables_empty').html(Web_NoKpiMetricsRecordsExists);
                        }
                    }
                    else if (data.status === "Fail") {
                        RedirectUrl = WebURL + 'Account/AccessDenied';
                        window.location.replace(RedirectUrl);
                    }
                }
            });
        }
        else {
            $('#KpiMetricsTblDiv').addClass('hide');
        }
        // To prevent entering text in date textbox
        //$('#txtStartDateSearchField, #txtEndDateSearchField').on('input', function () {
        //    this.value = this.value.match(/^\d*$/);
        //});
        $('#txtStartDateSearchField, #txtEndDateSearchField').datepicker({
            format: "dd-M-yyyy"
        });
    });
    $(document).on('click', '.ViewWorkitemTask', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#tblKpiMetrics').DataTable();
        var data_row_table = table.row($(this).closest('tr')).data();
        var taskID = data_row_table.TaskID;
        var workflowID = data_row_table.WorkflowID;
        var PostUrl = WebURL + "WorkflowInstance/EditTask";
        $.ajax({
            type: 'GET',  // http method
            url: PostUrl,
            data: { taskID: taskID, workflowID: workflowID },  // data to submit                    
            success: function (data, status, xhr) {
                $(".TaskEditModalBody").html('');
                $(".TaskEditModalBody").html(data);
                $("#txtWFITaskName,#ddlWFITaskTemplate,#ddlWFITaskStatus,#txtWFITaskDuration,#txtWFITaskStartDate,#txtWFITaskEndDate,#ddlResponsibility,#Taskflag").prop("disabled", true);
                $(".TaskEditCancel").addClass('hide');
                $('#TaskEditModal').modal('show');
            }
        });
    });
    //$(document).on('click', '.TaskEditModalClose', function (e) {
    //    e.preventDefault();
    //    e.stopImmediatePropagation();
    //    $(".TaskEditModalBody").html('');
    //    $('#TaskEditModal').modal('hide');
    //});
    $(document).on('click', '.ViewWorkitemWorkflow', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#WorkflowViewgrid').DataTable();
        var data_row_table = table.row($(this).closest('tr')).data();
        var workflowID = data_row_table.WorkflowID;
        var url = WebURL + "WorkflowInstance/ViewWorkflow?workflowInstanceID=" + workflowID;
        window.location.href = url;
    });
    $(document).on('keyup change', '#txtTaskNameSearchField, #txtTimeSpentSearchField, #txtWorkflowNameSearchField, #txtStartDateSearchField, #txtEndDateSearchField, #txtStatusSearchField', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#tblKpiMetrics').DataTable();
        var key = e.which;
        if (key === 9 || key === 16) {
            return false;
        }
        var txtTaskName = $('#txtTaskNameSearchField').val();
        if (txtTaskName === null || txtTaskName === undefined) {
            txtTaskName = "";
        }
        var txtTimeSpent = $('#txtTimeSpentSearchField').val();
        if (txtTimeSpent === null || txtTimeSpent === undefined) {
            txtTimeSpent = "";
        }
        var txtWorkflowName = $('#txtWorkflowNameSearchField').val();
        if (txtWorkflowName === null || txtWorkflowName === undefined) {
            txtWorkflowName = "";
        }
        var txtStartDate = $("#txtStartDateSearchField").val();
        if (txtStartDate === null || txtStartDate === undefined) {
            txtStartDate = "";
        }
        var txtEndDate = $("#txtEndDateSearchField").val();

        if (txtEndDate === null || txtEndDate === undefined) {
            txtEndDate = "";
        }
        var txtStatus = $("#txtStatusSearchField").val();
        if (txtStatus === null || txtStatus === undefined) {
            txtStatus = "";
        }
        SearchColumnName = $(this).parent().parent().data('headername');
        if (SearchColumnName === "TaskName" || SearchColumnName === "WorkflowName" || SearchColumnName === "TimeSpent" || SearchColumnName === "StartDate" || SearchColumnName === "EndDate" || SearchColumnName === "Status") {
            SearchString = [txtTaskName, txtTimeSpent, txtWorkflowName, txtStartDate, txtEndDate, txtStatus];
        } else {
            SearchString = this.value;
        }
        url = WebURL + 'WorkitemEnduser/GetKpiMetricsSearchRecords';
        var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, metricsID: $("#DrpkpiMetrics").val(), workItemID: $("#WorkItemInstanceID").val() };
        var Searchdata;
        $.post(url, params, function (data) {
            Searchdata = data;
            recordsearch = "Performed";
            table.clear().rows.add(Searchdata).draw();
        });
    });
});

var WorkItemId;
function WIInstanceValidations() {
    var validateafields = true;
    var WIInstanceName = $("#txtWIInstanceName").val();
    var WIDescription = $("#txtWIDescription").val();
    var WINotes = $("#addNotes").val();
    var Status = $("#ddlStatus").val();
    var Workspace = $("#ddlrelatedwspaceInstance").val();
    var WITemplate = $("#ddlwITemplate").val();
    var WIFinanceDiv = $("#ddlwIfindivsion").val();
    var WISAGEOwner = $("#ddlwISAGEOwner").val();
    var allowedmaxlength_WIInstName = $('#txtWIInstanceName').data('maxlength');
    var allowedmaxlength_WIInstDescription = $('#txtWIDescription').data('maxlength');
    var allowedmaxlength_WINotes = $('#addNotes').data('maxlength');
    var value = WIInstanceName;
    var labelName;
    var CurrentId;
    if ($("#txtWIInstanceID").val() == null || $("#txtWIInstanceID").val() == "") {
        WorkItemID = 0;
    }
    else {
        WorkItemID = $("#txtWIInstanceID").val();
    }
    var Isavilable = CheckWorkItemAvailability(value, WorkItemID);
    if (Isavilable) {
        //$('.errmsg' + CurrentId).remove();
        //varErrorClassName = 'errmsg' + CurrentId;
        //$('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", value) + '</span>');
        //ShowDuplicateWINamePopMessage('Alert', value);
        var msg = Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", WIInstanceName);
        $('#WIEditSuccessMsg').removeClass('hide');
        $('#WIEditSuccessMsg').html(msg);
        $('#WIEditSuccessMsg').addClass('txtcolourforestgreen');
        window.scrollTo(0, 0);
        setTimeout(function () { $("#WIEditSuccessMsg").html(''); }, Web_MsgTimeOutValue);
    }

    if (WIInstanceName === "") {
        labelName = $('#txtWIInstanceName').data('validatelabel');
        CurrentId = $('#txtWIInstanceName').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
        validateafields = "ReqField_Invalid";
    }
    if (Status === "") {
        labelName = $('#ddlStatus').data('validatelabel');
        CurrentId = $('#ddlStatus').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
        validateallfields = "ReqField_Invalid";
    }
    if (Workspace === "") {
        labelName = $('#ddlrelatedwspaceInstance').data('validatelabel');
        CurrentId = $('#ddlrelatedwspaceInstance').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
        validateallfields = "ReqField_Invalid";
    }
    if (WITemplate === "") {
        labelName = $('#ddlwITemplate').data('validatelabel');
        CurrentId = $('#ddlwITemplate').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
        validateallfields = "ReqField_Invalid";
    }
    //if (WIFinanceDiv === "") {
    //    labelName = $('#ddlwIfindivsion').data('validatelabel');
    //    CurrentId = $('#ddlwIfindivsion').attr('id');
    //    $('.errmsg' + CurrentId).remove();
    //    varErrorClassName = 'errmsg' + CurrentId;
    //    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
    //    validateallfields = "ReqField_Invalid";
    //}
    //if (WISAGEOwner === "") {
    //    labelName = $('#ddlwISAGEOwner').data('validatelabel');
    //    CurrentId = $('#ddlwISAGEOwner').attr('id');
    //    $('.errmsg' + CurrentId).remove();
    //    varErrorClassName = 'errmsg' + CurrentId;
    //    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + ' </span>');
    //    validateallfields = "ReqField_Invalid";
    //}
    if (WIInstanceName.length > allowedmaxlength_WIInstName) {
        labelName = $('#txtWIInstanceName').data('validatelabel');
        CurrentId = $('#txtWIInstanceName').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength_WIInstName) + ' ');
        validateafields = false;
    }
    if (WIDescription.length > allowedmaxlength_WIInstDescription) {
        labelName = $('#txtWIDescription').data('validatelabel');
        CurrentId = $('#txtWIDescription').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength_WIInstDescription) + ' ');
        validateafields = false;
    }
    if (WINotes.length > allowedmaxlength_WINotes) {
        labelName = $('#addNotes').data('validatelabel');
        CurrentId = $('#addNotes').attr('id');
        $('.errmsg' + CurrentId).remove();
        varErrorClassName = 'errmsg' + CurrentId;
        $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_AllowsMaxCharacters.replace("{0}", allowedmaxlength_WINotes) + ' ');
        validateafields = false;
    }

    if (typeof $('#addNotes').val() !== 'undefined') {
        if ($('#addNotes').val().trim().length > allowedmaxlength_WINotes) {
            labelName = $('#addNotes').data('validatelabel');
            CurrentId = $('#addNotes').attr('id');
            $('.errmsg' + CurrentId).remove();
            varErrorClassName = 'errmsg' + CurrentId;
            $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">Allows maximum ' + allowedmaxlength_Notes + ' characters.');
            validateafields = false;
        }
    }
    return validateafields;
}
function ShowWIInstAlertMessage(title, messgae) {
    $('#WIInstAlertModal').modal('show');
    var modal = $('#WIInstAlertModal');
    modal.find('.modal-title').text(title)
    modal.find('.modal-body').text(messgae);
}
function AlertPopUp(title, message) {
    $('#AlertModal').modal('show');
    var modal = $('#AlertModal');
    modal.find('.modal-title').text(title);
    modal.find('.modal-body').text(message);
}

function ShowDuplicateWINamePopMessage(title, message) {
    $('#WINameDuplicateAlertModal').modal('show');
    var modal = $('#WINameDuplicateAlertModal');
    modal.find('.modal-title').text(title);
    modal.find('.modal-body p').html('<span>' + Web_WorkItemInstanceAlreadyExistsInlineMessage.replace("{0}", message + '</span>'));
}

function ShowWorkItemSuccess(message) {

    $('#UpdateWIModal').modal('show');
    var modal = $('#UpdateWIModal');
    modal.find('.modal-title').text('Success!');
    var message = $('#txtWIInstanceName').val();
    //modal.find('.modal-body').html("<p>Work Item <b>" + message + "</b>  updated successfully.</p>");
    modal.find('.modal-body').html('<span>' + Web_WorkItemInstanceUpdate.replace("{0}", message) + '</span> ');
}

function CheckWorkItemAvailability(value, WorkItemID) {
    var resopnseobj = false;
    var params = { workitemName: value, workitemID: WorkItemID };
    $.ajax({
        type: 'POST',
        url: "WorkItemDuplicatecheck",
        data: params,
        async: false,
        success: function (response) {
            resopnseobj = response;
        }
    });
    return resopnseobj;
}

function FileNameDuplicatecheck(value, WorkItemID, AttachmentTypeName, IsFileOrLink, AttachmentID) {
    var resopnseobj = false;
    var params = { fileName: value, workitemID: WorkItemID, attachmentTypeName: AttachmentTypeName, isFileOrLink: IsFileOrLink, wiAttachmentID: AttachmentID };
    $.ajax({
        type: 'POST',
        url: "FileNameDuplicatecheck",
        data: params,
        async: false,
        success: function (response) {
            resopnseobj = response;
        }
    });
    return resopnseobj;
}
function CheckDomainName(domainName) {
    var resopnseobj = false;
    var params = { domainName: domainName };
    $.ajax({
        type: 'POST',
        url: "VerifyDomainName",
        data: params,
        async: false,
        success: function (response) {
            resopnseobj = response;
        }
    });
    return resopnseobj;
}
function ConformDuplicateFilenamePopup(fileNames) {
    $('#DuplicateFileNamePopup').modal('show');
    var modal = $('#DuplicateFileNamePopup');
    modal.find('.modal-title').text('Info!');
    modal.find('.modal-body').html(Web_WorkItemFileDuplicateMsg.replace("{0}", fileNames));
}
function CheckSerachTagNameAvailability(value) {
    var resopnseobj = false;
    var params = { searchTagName: value };
    $.ajax({
        type: 'POST',
        url: "SearchTagDuplicatecheck",
        data: params,
        async: false,
        success: function (response) {
            resopnseobj = response;
        }
    });
    return resopnseobj;
}
function GetAttachmentType(attachmentTypeID) {
    var resopnseobj;
    var params = { attachmentTypeID: attachmentTypeID };
    $.ajax({
        type: 'POST',
        url: "GetAttachmentType",
        data: params,
        async: false,
        success: function (response) {
            resopnseobj = response;
        }
    });
    return resopnseobj;
}
function RelatedWorkitemsDuplicateCheck(WIID, WSID, RELID) {
    var res = true;
    var wiid;
    if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist != null) {
        var ListLen = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist.length;
        if (ListLen != null || ListLen != 0) {
            for (i = 0; i < ListLen; i++) {
                var wsid = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[i].WorkspaceInstanceID;
                //var wiid = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[i].WorkItemInstanceID;
                var relid = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[i].Relationship;
                if (relid === "Parent") {
                    wiid = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[i].ParentWorkItemInstanceID;
                }
                else if (relid === "Child") {
                    wiid = workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[i].ChildWorkItemInstanceID;
                }
                if (WIID == wiid && WSID == wsid && RELID == relid) {
                    res = false;
                }
            }
        }
    }
    return res;
}

function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }

        //tbl = $('#myTable').DataTable();



        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}
$(document).on('click', '.ViewWorkitem', function () {
    var table = $('#WorkitemViewgrid').DataTable();
    var data_row_table = table.row($(this).closest('tr')).data();
    var WorkitemId = data_row_table.WorkItemInstanceID;
    var url = "/WorkitemEnduser/ViewWorkitem?workitemID=" + WorkitemId;
    window.location.href = url;
});

$(document).on('click', '.linkrel', function () {
    var table = $('#WorkitemViewgrid').DataTable();
    var data_row_table = table.row($(this).closest('tr')).data();
    var WorkitemId = data_row_table.WorkItemInstanceID;
    var url = "/WorkitemEnduser/RedirectRelatedWorkitem?workitemID=" + WorkitemId;
    window.location.href = url;
});

//$(document).on('click', '#AddingWIWSRelationship', function (e) {
//    e.preventDefault();
//    e.stopImmediatePropagation();
//    var selectedworkiteminstnaceID = 0;
//    var selectedworkiteminstnaceName = 0;
//    var selectedWorkspaceID = $("#relatedwsddl option:selected").val();
//    var workitemTemplateID = $("#ddlwITemplate option:selected").val();
//    var RelatedworkspaceID = $("#ddlrelatedwspaceInstance option:selected").val();
//    var params = { workspaceID: RelatedworkspaceID, workitemTemplateID: workitemTemplateID, selectedWorkspaceID: selectedWorkspaceID };
//    $.post('/WorkitemEnduser/LoadWSRelatedWIInstances', params, function (data, status) {
//        $('#WSRelatedWIRelationPoup').modal('show');
//        var List = data;
//        if (data !== null) {
//            table3 = $('#WSRelatedWIList').DataTable({
//                "stripeClasses": [],
//                "destroy": true,
//                "processing": false,
//                "orderMulti": false,
//                "filter": false,
//                "pageLength": 7,
//                //"order": [2, "asc"],
//                "paging": true,
//                "dom": '<"toolbar">frtip',
//                "scrollY": '50vh',
//                "language": {
//                    "emptyTable": function (data) {
//                        if ((recordsearch === "load" && data === "0") || (recordsearch === "load" && data === "")) {
//                            $('#btnWSWIRelationPoupOk').attr("disabled", true);
//                            $('#btnWSWIRelationPoupOk').css("cursor", 'not-allowed');
//                            return Web_Noworkitems;
//                        }
//                        else {
//                            $('#btnWSWIRelationPoupOk').attr("disabled", true);
//                            return "No data is available";
//                        }
//                    }
//                },
//                "data": List,
//                "createdRow": function (row, data, dataIndex) {
//                    if (data.SelectedWIinPopup == true) {
//                        //$(row).addClass('selected');
//                        $('#btnWSWIRelationPoupOk').attr("disabled", false);
//                    }
//                    else {
//                        $('#btnWSWIRelationPoupOk').attr("disabled", true);
//                    }
//                },
//                "select": {
//                    "style": 'os',
//                    "selector": 'td:first-child'
//                },
//                "columns": [

//                    { "data": "WorkItemInstanceID", "name": "WorkItemInstanceID", "className": "col-md-1 hidden", "orderable": false },
//                    { "data": "Action", "name": "WorkItemInstanceID", "className": "col-md-1", "orderable": false },
//                    { "data": "WorkItemInstanceName", "name": "WorkItemInstanceName", "className": "col-md-1", "orderable": false },
//                    { "data": "WorkItemTemplateName", "name": "WorkItemTemplateName", "className": "col-md-1", "orderable": false }
//                ],
//                'columnDefs': [{
//                    'targets': 1,
//                    'searchable': false,
//                    'orderable': false,
//                    'className': 'dt-body-center',
//                    'render': function (data, type, full, meta) {
//                        if (full.SelectedWIinPopup === true) {
//                            return '<input type="radio" class ="wsrelatedwiList" name="workitemID" Checked value="'
//                                + full.WorkItemInstanceID + '">';
//                        }
//                        else {
//                            return '<input type="radio" class ="wsrelatedwiList" name="workitemID" value="'
//                                + full.WorkItemInstanceID + '">';
//                        }
//                    }
//                }],
//                drawCallback: function () {

//                },
//                'rowCallback': function (row, data, dataIndex) {
//                }
//            });

//            $("#txtwiIteminSearchField, #txtwiItemTempSearchField").on('keyup', function () {
//                e.preventDefault();
//                e.stopImmediatePropagation();
//                var table = $('#WSRelatedWIList').DataTable();
//                var key = e.which;
//                if (key === 9 || key === 16) {
//                    return false;
//                }
//                if ($('#txtwiIteminSearchField').val() !== "" && key === 16) {
//                    $("#txtwiItemTempSearchField").focus();
//                }
//                SearchColumnName = $(this).parent().parent().data('headername');
//                if (SearchColumnName === "Work item") {
//                    txtworkItemName = $(this).val();
//                    txtworkItemTemplateName = $('#txtwiItemTempSearchField').val();
//                    if (txtworkItemTemplateName === undefined) {
//                        txtworkItemTemplateName = "";
//                    }
//                    SearchString = [txtworkItemName, txtworkItemTemplateName];
//                }
//                else if (SearchColumnName === "Work item template") {
//                    if (txtworkItemName === undefined) {
//                        txtworkItemName = "";
//                    }
//                    txtworkItemName = $('#txtwiIteminSearchField').val();
//                    txtworkItemTemplateName = $(this).val();
//                    SearchString = [txtworkItemName, txtworkItemTemplateName];
//                }
//                url = WebURL + 'WorkitemEnduser/GetWSRelatedWISearchRecords';
//                var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
//                var Searchdata;
//                $.post(url, params, function (data) {
//                    Searchdata = data;
//                    recordsearch = "Performed";
//                    table.clear().rows.add(Searchdata).draw();
//                });
//            });

//            $('#WSRelatedWIList tbody').on('click', 'input[type="radio"]', function (e) {
//                var $row = $(this).closest('tr');
//                var table2 = $("#WSRelatedWIList").DataTable();
//                // Get row data
//                var data = table3.row($row).data();
//                // Get Workitem Instnace ID
//                selectedworkiteminstnaceID = data.WorkItemInstanceID;
//                selectedworkiteminstnaceName = data.WorkItemInstanceName;

//                if (selectedworkiteminstnaceID !== 0) {
//                    $('#btnWSWIRelationPoupOk').attr("disabled", false);
//                }
//                else {
//                    $('#btnWSWIRelationPoupOk').attr("disabled", true);
//                }
//                //if (WorkitemInstnaceID !== null) {
//                //    $row.addClass('selected');
//                //}
//                //var s = rows_selected;
//                //if (this.checked) {
//                //    $row.addClass('selected');
//                //} else {
//                //    $row.removeClass('selected');
//                //}
//                // Update state of "Select all" control
//                //updateDataTableSelectAllCtrl(table3);
//                // Prevent click event from propagating to parent
//                e.stopPropagation();
//            });

//            // Handle click on table cells with checkboxes
//            $('#WSRelatedWIList').on('click', 'tbody td, thead th:first-child', function (e) {
//                $(this).parent().find('input[type="checkbox"]').trigger('click');
//            });

//            // Handle table draw event
//            table3.on('draw', function () {
//                // Update state of "Select all" control
//                // updateDataTableSelectAllCtrl(table3);
//            });

//            // Handle form submission event 
//            $('#btnWSWIRelationPoupOk').one('click', function (e) {
//                var form = $("#WIListGrid");
//                $('#txtwiItemInSearchField').val("");
//                var table2 = $("#WSRelatedWIList").DataTable();
//                var workitemInsatceID = selectedworkiteminstnaceID;
//                var workitemInsatceName = selectedworkiteminstnaceName;
//                $('#WSWIRelInstanceName').val(selectedworkiteminstnaceName);
//                $('#wsRelatedSelectedWII').val(selectedworkiteminstnaceID);

//                // Sends the selected Workitem Ids to the Loading 
//                workitemID = selectedworkiteminstnaceID;
//                $.ajax('/WorkitemEnduser/GetwiRelationship', {
//                    type: 'Post',  // http method
//                    async: false,
//                    data: { workitemID: workitemID },  // data to submit
//                    success: function (data, status, xhr) {
//                        if (status === 'success') {
//                            if (data.length > 0) {
//                                $("#relatedRelationship").empty();
//                                defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
//                                $("#relatedRelationship").append(defaultOpt);
//                                $.each(data, function (i, state) {
//                                    $("#relatedRelationship").append('<option value="' + data[i].Value + '">' +
//                                        data[i].Text + '</option>');
//                                });
//                            }
//                            else {
//                                $("#relatedRelationship").empty();
//                                defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
//                                $("#relatedRelationship").append(defaultOpt);
//                            }
//                        }
//                        else {
//                            // ShowModalDialog('Alert!', 'No multiple content type in previous level', false);
//                            $("#relatedRelationship").empty();
//                            defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
//                            $("#relatedRelationship").append(defaultOpt);
//                        }
//                        //$("#WSRelatedWIRelationPoup").modal('hide');
//                    }
//                });

$(document).on('click', '#AddingWIWSRelationship', function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var selectedworkiteminstnaceID = 0;
    var selectedworkiteminstnaceName = 0;
    var selectedWorkspaceID = $("#relatedwsddl option:selected").val();
    var workitemTemplateID = $("#ddlwITemplate option:selected").val();
    var RelatedworkspaceID = $("#ddlrelatedwspaceInstance option:selected").val();
    var params = { workspaceID: RelatedworkspaceID, workitemTemplateID: workitemTemplateID, selectedWorkspaceID: selectedWorkspaceID };
    $.post('/WorkitemEnduser/LoadWSRelatedWIInstances', params, function (data, status) {
        $('#WSRelatedWIRelationPoup').modal('show');
        var List = data;
        if (data !== null) {
            table3 = $('#WSRelatedWIList').DataTable({
                "stripeClasses": [],
                "destroy": true,
                "processing": false,
                "orderMulti": false,
                "filter": false,
                "pageLength": 7,
                //"order": [2, "asc"],
                "paging": true,
                "dom": '<"toolbar">frtip',
                "scrollY": '50vh',
                "language": {
                    "emptyTable": function (data) {
                        if ((recordsearch === "load" && data === "0") || (recordsearch === "load" && data === "")) {
                            $('#btnWSWIRelationPoupOk').addClass('Button-disable');
                            $('#btnWSWIRelationPoupOk').removeClass('Button');
                            $('#btnWSWIRelationPoupOk').attr("disabled", true);
                            $('#btnWSWIRelationPoupOk').css("cursor", 'not-allowed');
                            return Web_Noworkitems;
                        }
                        else {
                            $('#btnWSWIRelationPoupOk').addClass('Button-disable');
                            $('#btnWSWIRelationPoupOk').removeClass('Button');
                            $('#btnWSWIRelationPoupOk').attr("disabled", true);
                            $('#btnWSWIRelationPoupOk').css("cursor", 'not-allowed');
                            return "No data is available";
                        }
                    }
                },
                "data": List,
                "createdRow": function (row, data, dataIndex) {
                    if (data.SelectedWIinPopup == true) {
                        //$(row).addClass('selected');
                        $('#btnWSWIRelationPoupOk').addClass('Button');
                        $('#btnWSWIRelationPoupOk').removeClass('Button-disable');
                        $('#btnWSWIRelationPoupOk').attr("disabled", false);
                        $('#btnWSWIRelationPoupOk').css("cursor", 'pointer');
                    }
                    else {
                        $('#btnWSWIRelationPoupOk').addClass('Button-disable');
                        $('#btnWSWIRelationPoupOk').removeClass('Button');
                        $('#btnWSWIRelationPoupOk').attr("disabled", true);
                        $('#btnWSWIRelationPoupOk').css("cursor", 'not-allowed');
                    }
                },
                "select": {
                    "style": 'os',
                    "selector": 'td:first-child'
                },
                "columns": [

                    { "data": "WorkItemInstanceID", "name": "WorkItemInstanceID", "className": "col-md-1 hidden", "orderable": false },
                    { "data": "Action", "name": "WorkItemInstanceID", "className": "col-md-1", "orderable": false },
                    { "data": "WorkItemInstanceName", "name": "WorkItemInstanceName", "className": "col-md-1", "orderable": false },
                    { "data": "WorkItemTemplateName", "name": "WorkItemTemplateName", "className": "col-md-1", "orderable": false }
                ],
                'columnDefs': [{
                    'targets': 1,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center',
                    'render': function (data, type, full, meta) {
                        if (full.SelectedWIinPopup === true) {
                            return '<input type="radio" class ="wsrelatedwiList" name="workitemID" Checked value="'
                                + full.WorkItemInstanceID + '">';
                        }
                        else {
                            return '<input type="radio" class ="wsrelatedwiList" name="workitemID" value="'
                                + full.WorkItemInstanceID + '">';
                        }
                    }
                }],
                drawCallback: function () {

                },
                'rowCallback': function (row, data, dataIndex) {
                }
            });

            $("#txtwiIteminSearchField, #txtwiItemTempSearchField").on('keyup', function () {
                e.preventDefault();
                e.stopImmediatePropagation();
                var table = $('#WSRelatedWIList').DataTable();
                var key = e.which;
                if (key === 9 || key === 16) {
                    return false;
                }
                if ($('#txtwiIteminSearchField').val() !== "" && key === 16) {
                    $("#txtwiItemTempSearchField").focus();
                }
                SearchColumnName = $(this).parent().parent().data('headername');
                if (SearchColumnName === "Work item") {
                    txtworkItemName = $(this).val();
                    txtworkItemTemplateName = $('#txtwiItemTempSearchField').val();
                    if (txtworkItemTemplateName === undefined) {
                        txtworkItemTemplateName = "";
                    }
                    SearchString = [txtworkItemName, txtworkItemTemplateName];
                }
                else if (SearchColumnName === "Work item template") {
                    if (txtworkItemName === undefined) {
                        txtworkItemName = "";
                    }
                    txtworkItemName = $('#txtwiIteminSearchField').val();
                    txtworkItemTemplateName = $(this).val();
                    SearchString = [txtworkItemName, txtworkItemTemplateName];
                }
                url = WebURL + 'WorkitemEnduser/GetWSRelatedWISearchRecords';
                var params = { searchColumnName: SearchColumnName, sSearchString: SearchString };
                var Searchdata;
                $.post(url, params, function (data) {
                    Searchdata = data;
                    recordsearch = "Performed";
                    table.clear().rows.add(Searchdata).draw();
                });
            });

            $('#WSRelatedWIList tbody').on('click', 'input[type="radio"]', function (e) {
                var $row = $(this).closest('tr');
                var table2 = $("#WSRelatedWIList").DataTable();
                // Get row data
                var data = table3.row($row).data();
                // Get Workitem Instnace ID
                selectedworkiteminstnaceID = data.WorkItemInstanceID;
                selectedworkiteminstnaceName = data.WorkItemInstanceName;

                if (selectedworkiteminstnaceID !== 0) {
                    $('#btnWSWIRelationPoupOk').addClass('Button');
                    $('#btnWSWIRelationPoupOk').removeClass('Button-disable');
                    $('#btnWSWIRelationPoupOk').attr("disabled", false);
                    $('#btnWSWIRelationPoupOk').css("cursor", 'pointer');
                }
                else {
                    $('#btnWSWIRelationPoupOk').addClass('Button-disable');
                    $('#btnWSWIRelationPoupOk').removeClass('Button');
                    $('#btnWSWIRelationPoupOk').attr("disabled", true);
                    $('#btnWSWIRelationPoupOk').css("cursor", 'not-allowed');
                }
                //if (WorkitemInstnaceID !== null) {
                //    $row.addClass('selected');
                //}
                //var s = rows_selected;
                //if (this.checked) {
                //    $row.addClass('selected');
                //} else {
                //    $row.removeClass('selected');
                //}
                // Update state of "Select all" control
                //updateDataTableSelectAllCtrl(table3);
                // Prevent click event from propagating to parent
                e.stopPropagation();
            });

            // Handle click on table cells with checkboxes
            $('#WSRelatedWIList').on('click', 'tbody td, thead th:first-child', function (e) {
                $(this).parent().find('input[type="checkbox"]').trigger('click');
            });

            // Handle table draw event
            table3.on('draw', function () {
                // Update state of "Select all" control
                // updateDataTableSelectAllCtrl(table3);
            });

            // Handle form submission event 
            $('#btnWSWIRelationPoupOk').one('click', function (e) {
                var form = $("#WIListGrid");
                $('#txtwiItemInSearchField').val("");
                var table2 = $("#WSRelatedWIList").DataTable();
                var workitemInsatceID = selectedworkiteminstnaceID;
                var workitemInsatceName = selectedworkiteminstnaceName;
                $('#WSWIRelInstanceName').val(selectedworkiteminstnaceName);
                $('#wsRelatedSelectedWII').val(selectedworkiteminstnaceID);

                // Sends the selected Workitem Ids to the Loading 
                workitemID = selectedworkiteminstnaceID;
                $.ajax('/WorkitemEnduser/GetwiRelationship', {
                    type: 'Post',  // http method
                    async: false,
                    data: { workitemID: workitemID },  // data to submit
                    success: function (data, status, xhr) {
                        if (status === 'success') {
                            if (data.length > 0) {
                                $("#relatedRelationship").empty();
                                defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
                                $("#relatedRelationship").append(defaultOpt);
                                $.each(data, function (i, state) {
                                    $("#relatedRelationship").append('<option value="' + data[i].Value + '">' +
                                        data[i].Text + '</option>');
                                });
                            }
                            else {
                                $("#relatedRelationship").empty();
                                defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
                                $("#relatedRelationship").append(defaultOpt);
                            }
                        }
                        else {
                            // ShowModalDialog('Alert!', 'No multiple content type in previous level', false);
                            $("#relatedRelationship").empty();
                            defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
                            $("#relatedRelationship").append(defaultOpt);
                        }
                        //$("#WSRelatedWIRelationPoup").modal('hide');
                    }
                });

                $('.WSWIRelationPoupCancel').on('click', function (e) {
                    rows_selected = [];
                    $('#WSRelatedWIList').DataTable().destroy();
                    $('#WSRelatedWIList').DataTable().draw();
                });

                $("#txtwiIteminSearchField").val('');
                $("#txtwiItemTempSearchField").val('');
                // Remove added elements
                $('input[name="id\[\]"]', form).remove();
                rows_selected = [];
                e.preventDefault();
            });
        }
    });
});
/***************************************************End Of Workitem Section******************************/

/*************************************************Workflow Section***************************************/
var ViewTaskResourceAllocation;
var ViewWorkflow = {

    init: function (args) {
        this.DashboardWorkflow = args.WorkflowViewModel;
        this.WebURL = args.URL;
        WebURL = this.WebURL;
        this.Mode = args.Mode;
        this.SaveMode = args.SaveMode;
        UserTaskPrivilege = args.UserTaskPrivilege;
        this.LoadUserTaskPrivileges(UserTaskPrivilege);
        this.loadWorkflowGrid();
        var workflowname = args.Workflowname;
        if (this.SaveMode === "WorkflowInsSaveSuccess") {
            var msg = Web_WorkflowInstSaveSuccessPopup.replace("{0}", workflowname);
            $('#worksflowInstSaveSuccessmsgs').removeClass('hide');
            $('#worksflowInstSaveSuccessmsgs').html(msg);
            setTimeout(function () { $("#worksflowInstSaveSuccessmsgs").html(''); }, Web_MsgTimeOutValue);
        }
        if (this.DashboardWorkflow !== null) {
            $('#WorkflowViewgrid tfoot th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') === true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var SearchId = id + 'SearchField';
                    var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            $('#WorkflowViewgrid tfoot th').hide();
        }
        this.searchGrid({ id: 'WorkflowViewgrid', url: WebURL + 'WorkflowEnduser/GetWorkflowSearchRecords', mode: this.Mode });
    },

    LoadUserTaskPrivileges: function (UserTaskPrivilege) {
        //This function is used to set the flags depends upon the prvileiges 
        if (UserTaskPrivilege !== null && UserTaskPrivilege !== undefined) {
            if (UserTaskPrivilege.ViewTaskResourceAllocation) {
                ViewTaskResourceAllocation = true;
            } else {
                ViewTaskResourceAllocation = false;
            }
        }
    },
    loadWorkflowGrid: function () {
        var data = this.DashboardWorkflow;
        var mode = this.Mode;
        var table = $('#WorkflowViewgrid').DataTable({
            "stripeClasses": [],
            "destroy": true,
            "processing": false, // for show progress bar
            //"serverSide": true, // for process server side
            "orderMulti": false,// for disable multiple column at once
            "filter": false,
            "searching": false,
            "order": [10, "asc"],
            // this is for disable filter (search box)
            "language": {
                "emptyTable": function (data) {
                    if ((recordsearch == "load" && data == "0") || (recordsearch == "load" && data == "")) {
                        return Web_NoWorkflowInstanceExists;
                    }
                    else if (((recordsearch === "Performed" || data === "0") && $('#txtWorkflowSearchField').val() === "" && $('#txtWorkflowTemplateSearchField').val() === "" && $('#txtWorkspaceInstanceSearchField').val() === "" && $('#txtWorkItemInstanceSearchField').val() === "")) {
                        return Web_NoWorkflowInstanceExists;
                    }
                    else {
                        return Web_NoSearchedWorkflowInstanceExists;
                    }
                }
            },
            "data": data,
            "createdRow": function (row, data, dataIndex) {
                if (data.Status === false) {
                    $(row).addClass('greyoutf');
                    $(row).find('.aicon').css("opacity", "0.5");
                    $(row).find('.dicon').css("opacity", "0.5");
                }
            },
            "columns": [

                { "data": "WorkflowID", "name": "ID", "className": "col-md-1 minwidth" },
                { "data": "WorkflowName", "name": "Workflow", "className": "col-md-4 minwidth", "orderable": true },
                { "data": "WorkflowTemplateName", "name": "Workflow template", "className": "col-md-2 minwidth", "orderable": true },
                { "data": "WorkspaceName", "name": "Workspace", "className": "col-md-1 minwidth", "orderable": true },
                { "data": "WorkItemName", "name": "Workitem", "className": "col-md-1 minwidth", "orderable": true },
                {
                    "data": "LastUpdatedDate", "name": "Last Updated On", "orderable": true, "type": "ce_datetime", "className": "col-md-2",
                    render: function (data, type, row) {
                        return moment.utc(data.replace(/-/g, ' ')).format('DD-MMM-YYYY HH:mm');
                    }
                },
                { "data": "Start_Date", "name": "Start Date", "className": "col-md-2 minwidth", "type": "date", "orderable": true },
                { "data": "End_Date", "name": "End Date", "className": "col-md-2 minwidth", "type": "date", "orderable": true },
                { "data": "Status", "name": "Status", "className": "", "orderable": true },
                {
                    data: null,
                    defaultContent: '',
                    name: null,
                    className: "col-md-1 minwidth",
                    orderable: false,
                    render: {
                        display: function (data, type, row) {
                            if (row.Status === true) {
                                return "<a class='ActivateDeativateWorkflow DeActivateWorkflow' style='cursor:pointer;' status='false'><label class='switch switchcustom'><input id = 'ActiveDeactiveWorkflow' type= 'checkbox' checked><span class='slider slidercustom round' title='Deactivate'></span></label></a>&nbsp;&nbsp;&nbsp;<a title='Edit' style='cursor:pointer;' class='editWorkflow'><span class='edit-img'></span></a>&nbsp;&nbsp;&nbsp;<a title='View tasks' style='cursor:pointer;' class='viewtasks'><span class='fa fa-tasks'></span></a>";

                            } else {
                                return "<a class='ActivateDeativateWorkflow ActivateWorkflow' style='cursor:pointer;' status='true'><label class='switch switchcustom'><input id = 'ActiveDeactiveWorkflow' type= 'checkbox' unchecked><span class='slider slidercustom round' title='Activate'></span></label></a>&nbsp;&nbsp;&nbsp;<a title='Edit' style='cursor:pointer;' class='editWorkflow'><span class='edit-img'></span></a>&nbsp;&nbsp;&nbsp;<a title='View tasks' style='cursor:pointer;' class='viewtasks'><span class='fa fa-tasks'></span></a>";
                            }
                        }
                    }
                },
                { "data": "WorkflowName", "name": "Workflow", "className": "col-md-2 minwidth", 'visible': false }
            ],
            columnDefs: [
                {
                    "targets": [1],
                    render: function (data, type, row) {
                        // return '<span style="cursor: pointer;" class="ViewWorkflow linkcolour tblWorkflowName">' + data + '</span>';
                        if (row.IsWorkflowLate === true && row.IsWorkflowProblem === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-triangle" title="' + Web_ProblemTask + '"></span >&nbsp;&nbsp;<span style="color: red;" class="fa fa-exclamation-circle" title="' + Web_TaskLate + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewWorkflow linkcolour">' + data + '</span>';
                        }
                        else if (row.IsWorkflowLate === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-circle" title="' + Web_TaskLate + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewWorkflow linkcolour">' + data + '</span>';

                        }
                        else if (row.IsWorkflowProblem === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-triangle" title="' + Web_ProblemTask + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewWorkflow linkcolour">' + data + '</span>';
                        }
                        else {
                            return '<span style="cursor: pointer;" class="ViewWorkflow linkcolour">' + data + '</span>';
                        }
                    }
                },
                {
                    "targets": [2],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewWorkflowTemplate linkcolour">' + data + '</span>';
                    }
                },
                {
                    "targets": [3],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewWorkflowWorkspace linkcolour">' + data + '</span>';
                    }
                },
                {
                    "targets": [4],
                    render: function (data, type, row) {
                        return '<span style="cursor: pointer;" class="ViewWorkflowWorkitem linkcolour">' + data + '</span>';
                    }
                },
                {
                    "targets": [8],
                    render: function (data, type, row) {
                        return data === true ? '<span class="aicon">A</span>' : '<span class="dicon">D</span>';
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                //For applying Prieviliges
                if (mode !== "ViewWorkItem") {
                    WorkflowInstancePermissionMap();
                }
            }
        });

        if (this.Mode === "ViewWorkflowFromWorkitem") {
            table.column(3).visible(false);
            table.column(4).visible(false);
        }
        var isFromDashboard = $('#isFromDashboard').val();
        if (this.Mode === "ViewWorkItem") {
            //$('.tblWorkflowName').removeClass('ViewWorkflow');
            //$('.tblWorkflowName').removeClass('linkcolour');
            //$('.tblWorkflowName').css('cursor', 'default');
            $('#WorkflowViewgrid tr td.dataTables_empty').html(Web_NoSearchedWorkflowInstanceExists);
            $('#WorkflowViewgrid').addClass('table customtable table-bordered dataTable');
            $('#WorkflowViewgrid tr td').css('white-space', 'normal');
            table.column(2).visible(false);
            table.column(3).visible(false);
            table.column(4).visible(false);
            table.column(9).visible(false);
            if (ViewTaskResourceAllocation === true) {
                $('.ViewWorkflow').addClass('linkcolour');
                $('.ViewWorkflow').css("pointer-events", "auto");
            }
            else if (isFromDashboard === "True") {
                $('.ViewWorkflow').removeClass('linkcolour');
                $('.ViewWorkflow').css("pointer-events", "none");
            }
        }
        $.fn.dataTableExt.oSort['date-pre'] = function (value) {
            return Date.parse(value.replace(/-/g, ' '));
            //moment(dt, "DD-MMM-YYYY HH:mm");
        };
        $.fn.dataTableExt.oSort['date-asc'] = function (a, b) {
            return a - b;
        };
        $.fn.dataTableExt.oSort['date-desc'] = function (a, b) {
            return b - a;
        };
        $(document).on('click', '.editWorkflow', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var workflowID = data_row_table.WorkflowID;
            var url = "/WorkflowInstance/EditWorkflow?workflowInstanceID=" + workflowID;
            window.location.href = url;
        });
        $(document).on('click', '.ViewWorkflow', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var workflowID = data_row_table.WorkflowID;
            var url = WebURL + "WorkflowInstance/ViewWorkflow?workflowInstanceID=" + workflowID;
            window.location.href = url;
        });
        $(document).on('click', '.ViewWorkflowTemplate', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkflowTemplateID = data_row_table.WorkflowTemplateID;
            var url = "/Workflow/View?WorkflowTemplateID=" + WorkflowTemplateID;
            window.location.href = url;
        });
        $(document).on('click', '.ViewWorkflowWorkspace', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var workspaceID = data_row_table.WorkspaceID;
            var url = "/WorkspaceEnduser/View?WSId=" + workspaceID;
            window.location.href = url;
        });
        $(document).on('click', '.ViewWorkflowWorkitem', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var workitemID = data_row_table.WorkItemID;
            var url = "/WorkitemEnduser/ViewWorkitem?workitemID=" + workitemID;
            window.location.href = url;
        });
        $(document).on('click', '.viewtasks', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var WorkflowId = data_row_table.WorkflowID;
            var WorkitemId = data_row_table.WorkItemID;
            var WorkspaceId = data_row_table.WorkspaceID;
            var Redirecturl = WebURL + "WorkflowEndUser/ViewTask?workspaceID=" + WorkspaceId + "&workItemID=" + WorkitemId + "&workflowID=" + WorkflowId;
            window.location.replace(Redirecturl);
        });
        this.ActivateDeactivateWorkflow();
        this.sortGrid({ id: 'WorkflowViewgrid', url: '/WorkflowEnduser/GetWorkflowSearchRecords' });
    },

    searchGrid: function (args) {
        var table = $('#' + args.id).DataTable();
        table.columns().every(function () {
            var that = this;
            $('input', this.footer()).on('keyup change', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var table = $('#WorkflowViewgrid').DataTable();
                var mode = args.mode;
                var key = e.which;
                if (key === 9 || key === 16) {
                    return false;
                }
                var txtWorkflow = $('#txtWorkflowSearchField').val();
                var txtWorkflowTemplate = $('#txtWorkflowTemplateSearchField').val();
                var txtWorkspaceInstance = $('#txtWorkspaceInstanceSearchField').val();
                var txtWorkitemInstance = $('#txtWorkItemInstanceSearchField').val();
                if (txtWorkflowTemplate === undefined) {
                    txtWorkflowTemplate = "";
                }
                if (txtWorkspaceInstance === undefined) {
                    txtWorkspaceInstance = "";
                    txtWorkitemInstance = "";
                }
                url = args.url;
                SearchColumnName = $(this).parent().parent().data('headername');
                if (SearchColumnName === "Workflow" || SearchColumnName === "Related workflow template" || SearchColumnName === "Workspace" || SearchColumnName === "Work item") {
                    SearchString = [txtWorkflow, txtWorkflowTemplate, txtWorkspaceInstance, txtWorkitemInstance];
                } else {
                    SearchString = this.value;
                }

                var WorkspaceID = "";
                var WorkItemID = "";
                if (mode === "ViewWorkItem") {
                    WorkspaceID = $("#hidWorkspaceInstanceID").val();
                    WorkItemID = $("#WorkItemInstanceID").val();
                }
                else {
                    WorkspaceID = $("#DrpWorkspaceInstance").val();
                    WorkItemID = $("#DrpWorkitemInstance").val();
                }
                var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, workspaceID: WorkspaceID, workItemID: WorkItemID };
                var Searchdata;
                $.post(url, params, function (data) {
                    Searchdata = data;
                    recordsearch = "Performed";
                    table.clear().rows.add(Searchdata).draw();
                });
            });
        });
    },

    sortGrid: function (args) {
        $('#WorkflowViewgrid th').click(function (e) {
            if ($(this).hasClass("sortheader")) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var colIndex = $(this).index();
                if (colIndex == 1) {
                    var currentElement = $(this).attr('id');
                    var sortOrder;
                    if (currentElement !== null && currentElement !== "") {
                        if ($(this).hasClass("sorti_desc")) {
                            sortOrder = "asc";
                        }
                        else if ($(this).hasClass("sorti_asc")) {
                            sortOrder = "desc";
                        }
                        else {
                            sortOrder = "asc";
                        }
                        sortByWorkflowColumns(colIndex, sortOrder);
                        if (sortOrder === "asc") {
                            $("#" + currentElement).addClass("sorti_asc");
                            $("#" + currentElement).removeClass("sorti_desc");
                        }
                        else if (sortOrder === "desc") {
                            $("#" + currentElement).addClass("sorti_desc");
                            $("#" + currentElement).removeClass("sorti_asc");
                        }
                    }
                    //$("#txtWorkflow").val('');
                    //$("#txtWorkflow").val('');
                }
            }
        });
    },

    ActivateDeactivateWorkflow: function () {
        $(document).on('change', '#ActiveDeactiveWorkflow', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#WorkflowViewgrid').DataTable();
            var data = table.row($(this).closest('tr')).data();
            var WorkflowID = data.WorkflowID;
            var currentStatus = data.Status;
            var toChangeStatus = true;
            if (currentStatus === true) {
                toChangeStatus = false;
                ActivateWorkflow();
            }
            if (toChangeStatus === true) {
                $.ajax({
                    type: "POST",
                    url: '/WorkflowInstance/GetResourcesListOfWorkflow',
                    data: { workflowInstanceId: WorkflowID },
                    success: function (data) {
                        toChangeStatus = false;
                        if (data !== null) {
                            if (data.IsActiveResourceExists === "1") {
                                var modal = $('#activateWorkflow');
                                modal.find('.modal-body').html('');
                                modal.find('.modal-body').html(Web_AssignResourcesForActivateWorkflow);
                                //if (data.Tasks !== null) {
                                //    if (data.Tasks.length > 0) {
                                //        modal.find('.modal-body').html(Web_AssignResourcesForActivateWorkflow + '</br></br>');
                                //        //for (var i = 0; i < data.Tasks.length; i++) {
                                //        //    if (i === data.Tasks.length - 1) {
                                //        //        modal.find('.modal-body').append(data.Tasks[i].TaskID);

                                //        //    } else {
                                //        //        modal.find('.modal-body').append(data.Tasks[i].TaskID + ', ');
                                //        //    }
                                //        //}                                        
                                //    }
                                //}
                                $('#activateWorkflow').modal('show');
                                modal.find('.modal-title').text('Alert!');

                                $("#btnOk").unbind().bind('click', function (e) {
                                    $('#activateWorkflow').modal('hide');
                                    var WorkspaceID = $("#DrpWorkspaceInstance").val();
                                    var WorkItemID = $("#DrpWorkitemInstance").val();
                                    var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, workspaceID: WorkspaceID, workItemID: WorkItemID };
                                    var Searchdata;
                                    $.post(WebURL + "WorkflowEnduser/GetWorkflowSearchRecords", params, function (data) {
                                        Searchdata = data;
                                        table.clear().rows.add(Searchdata).draw();
                                    });
                                });
                            }
                            else {
                                toChangeStatus = true;
                                ActivateWorkflow();
                            }
                        }
                    }
                });
            }
            //ActivateWorkflow();
            function ActivateWorkflow() {
                var params = { workflowID: WorkflowID, status: toChangeStatus };
                var PostUrl = WebURL + "WorkflowEnduser/ActivateDeactivateWorkflow";
                $.ajax({
                    type: 'POST',
                    url: PostUrl,
                    data: params,
                    async: false,
                    success: function (data) {
                        var table = $('#WorkflowViewgrid').DataTable();
                        if (SearchColumnName === '' && SearchString === '') {
                            SearchColumnName: "All Workflow";
                            sSearchString: "";
                        }
                        var WorkspaceID = $("#DrpWorkspaceInstance").val();
                        var WorkItemID = $("#DrpWorkitemInstance").val();
                        var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, workspaceID: WorkspaceID, workItemID: WorkItemID };
                        var Searchdata;
                        $.post(WebURL + "WorkflowEnduser/GetWorkflowSearchRecords", params, function (data) {
                            Searchdata = data;
                            table.clear().rows.add(Searchdata).draw();
                        });
                        if (data.respStatus !== null) {
                            var message;
                            if (data.respStatus.status === "Fail") {
                                message = Web_WorkflowStatusChange.replace("{0}", data.respStatus.message);
                                $('#workflowStatusChange').removeClass('hide');
                                $('#workflowStatusChange').html(message);
                                setTimeout(function () { $("#workflowStatusChange").html(''); }, Web_MsgTimeOutValue);
                            }
                            else if (data.respStatus.status === "CONCURRENCY") {
                                message = Web_Concurrency;
                                $('#workflowStatusChange').removeClass('hide');
                                $('#workflowStatusChange').html(message);
                                setTimeout(function () { $("#workflowStatusChange").html(''); }, Web_MsgTimeOutValue);
                            }
                            else if (data.respStatus.status === "Insufficient privilleges") {
                                message = data.respStatus.message;
                                $('#workflowStatusChange').removeClass('hide');
                                $('#workflowStatusChange').html(message);
                                setTimeout(function () { $("#workflowStatusChange").html(''); }, Web_MsgTimeOutValue);
                            }
                            else {
                                $('#workflowStatusChange').addClass('hide');
                            }
                        }
                    }
                });
            }
        });

    }
};

//Used for Workflow
$(document).ready(function (e) {
    $("#DrpWorkspaceInstance").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#WorkflowViewgrid').DataTable();
        table.clear();
        table.draw();
        var selectedIndex = $('#DrpWorkspaceInstance option:selected').index();
        if (selectedIndex > 0) {
            $("#DrpWorkitemInstance").empty();
            var defaultOpt = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#DrpWorkitemInstance").prepend(defaultOpt);
            $.post('GetWorkitemInstanceList', { workspaceID: $("#DrpWorkspaceInstance").val() }, function (data, status) {
                if (status === 'success') {
                    if (data.length > 0) {
                        $.each(data, function (i, state) {
                            $("#DrpWorkitemInstance").append('<option value="' + data[i].value + '">' +
                                data[i].text + '</option>');
                        });
                    }
                }
            });
        }
        else {
            $("#DrpWorkitemInstance").empty();
            var defaultOption = "<option selected='selected' value='-1'>--Please select--</option>";
            $("#DrpWorkitemInstance").prepend(defaultOption);
        }
    });

    $("#DrpWorkitemInstance").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#WorkflowViewgrid').DataTable();
        var selectedIndex = $('#DrpWorkitemInstance option:selected').index();
        if (selectedIndex > 0) {
            $.post('GetWorkflowView', { workspaceID: $("#DrpWorkspaceInstance").val(), workItemID: $("#DrpWorkitemInstance").val() }, function (data, status, row) {
                if (status === 'success') {
                    var Searchdata;
                    if (data.length > 0) {
                        Searchdata = data;
                        table.clear().rows.add(Searchdata).draw();
                    } else {
                        table.clear();
                        table.draw();
                    }
                }
            });
        }
    });

    $(document).on('click', '.CreateWorkflowInstance', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var WorkitemID = $('#DrpWorkitemInstance').val();
        var Redirecturl = WebURL + "WorkflowInstance/CreateWorkflowInstance?workItemID=" + WorkitemID;
        window.location.href = Redirecturl;
    });
});
/*************************************************End of Workflow Section***************************************/

/*************************************************Tasks Section***************************************/

var ViewTasks = {

    init: function (args) {
        this.DashboardTasks = args.TasksViewModel;
        this.WebURL = args.URL;
        WebURL = this.WebURL;
        this.Mode = args.Mode;
        this.loadTasksGrid();
        var taskname = args.TaskName;
        if (this.DashboardTasks !== null) {
            $('#TasksViewgrid tfoot th').each(function () {
                var val = $(this).data('searchable');
                if ($(this).data('searchable') === true) {
                    var title = $(this).text();
                    var id = $(this).attr('id');
                    var SearchId = id + 'SearchField';
                    var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
                    $(this).html(InputSearchbox);
                }
            });
        } else {
            $('#TasksViewgrid tfoot th').hide();
        }
        $('#txtStartDateSearchField, #txtEndDateSearchField').datepicker({
            format: "d-M-yyyy"
        });
        $('#txtStartDateSearchField').attr("placeholder", "dd-MMM-yyyy");
        $('#txtEndDateSearchField').attr("placeholder", "dd-MMM-yyyy");
        this.searchGrid({ id: 'TasksViewgrid', url: WebURL + 'WorkflowEnduser/GetTaskSearchRecords' });
    },

    loadTasksGrid: function () {
        var data = this.DashboardTasks;
        var table = $('#TasksViewgrid').DataTable({
            "stripeClasses": [],
            "destroy": true,
            "processing": false,
            "orderMulti": false,
            "filter": false,
            "searching": false,
            "order": [8, "asc"],
            "language": {
                "emptyTable": function (data) {
                    if ((recordsearch == "load" && data == "0") || (recordsearch == "load" && data == "")) {
                        return Web_NoTaskInstanceExists;
                    }
                    else if ((recordsearch === "Performed" && data === "0" && $('#txtTaskNameSearchField').val() === "" && $('#txtResponsibilitySearchField').val() === "" && $('#txtAssigneeSearchField').val() === "" && $('#txtWorkflowStatusSearchField').val() === "")) {
                        return Web_NoTaskInstanceExists;
                    }
                    else {
                        return Web_NoSearchedTaskInstanceExists;
                    }
                }
            },
            "data": data,
            "createdRow": function (row, data, dataIndex) {
                if (data.Status === false) {
                    $(row).addClass('greyoutf');
                    $(row).find('.aicon').css("opacity", "0.5");
                    $(row).find('.dicon').css("opacity", "0.5");
                }
            },
            "columns": [
                { "data": "TaskID", "name": "ID", "className": "" },
                { "data": "TaskName", "name": "TaskName", "className": "col-md-2 minwidth", "orderable": true },
                { "data": "Duration", "name": "Duration", "className": "col-md-1 minwidth", "orderable": true },
                { "data": "Start_Date", "name": "Start Date", "type": "date", "className": "col-md-2 minwidth", "orderable": true },
                { "data": "End_Date", "name": "End Date", "type": "date", "className": "col-md-2 minwidth", "orderable": true },
                { "data": "Responsibility", "name": "Responsibility", "className": "col-md-1 minwidth", "orderable": true },
                { "data": "Assignee", "name": "Assignee", "className": "col-md-1 minwidth", "orderable": true },
                { "data": "Status", "name": "Status", "className": "col-md-1 minwidth", "orderable": true },
                { "data": "TaskName", "name": "TaskName", "className": "col-md-2 minwidth", 'visible': false }
                //{
                //    data: null,
                //    defaultContent: '',
                //    name: null,
                //    className: "col-md-1 minwidth",
                //    orderable: false,
                //    render: {                        
                //        display: function (data, type, row) {
                //return "<a title='Edit' style='cursor:pointer;' class='editTask'><span class='far fa-edit'></span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a title='Clone Task' style='cursor:pointer;' class=''><span class='far fa-copy'></span></a>";                            
                //        }
                //    }
                //}
            ],
            columnDefs: [
                {
                    "targets": [1],
                    render: function (data, type, row) {
                        if (row.IsTaskProblem === true && row.IsLate === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-triangle" title="' + Web_ProblemTask + '"></span >&nbsp;&nbsp;<span style="color: red;" class="fa fa-exclamation-circle" title="' + Web_TaskLate + '"></span >&nbsp;&nbsp;&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewTask linkcolour">' + data + '</span>';
                        }
                        else if (row.IsLate === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-circle" title="' + Web_TaskLate + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewTask linkcolour">' + data + '</span>';
                        }
                        else if (row.IsTaskProblem === true) {
                            return '<span style="color: red;" class="fa fa-exclamation-triangle" title="' + Web_ProblemTask + '"></span >&nbsp;&nbsp;<span style="cursor: pointer;" class="ViewTask linkcolour">' + data + '</span>';
                        }
                        else {
                            return '<span style="cursor: pointer;" class="ViewTask linkcolour">' + data + '</span>';
                        }
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                //For applying Prieviliges
                //WorkspaceInstancePermissionMap();
            }
        });

        $.fn.dataTableExt.oSort['date-pre'] = function (value) {
            return Date.parse(value.replace(/-/g, ' '));
            //moment(dt, "DD-MMM-YYYY HH:mm");
        };
        $.fn.dataTableExt.oSort['date-asc'] = function (a, b) {
            return a - b;
        };
        $.fn.dataTableExt.oSort['date-desc'] = function (a, b) {
            return b - a;
        };
        $(document).on('click', '.editTask', function () {
            //var table = $('#TasksViewgrid').DataTable();
            //var data_row_table = table.row($(this).closest('tr')).data();
            //var workflowID = data_row_table.WorkflowID;
            //var url = "/WorkspaceEnduser/Edit?workflowID=" + workflowID;
            //window.location.href = url;
            //window.location.href = url;
        });
        $(document).on('click', '.ViewTask', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var table = $('#TasksViewgrid').DataTable();
            var data_row_table = table.row($(this).closest('tr')).data();
            var taskID = data_row_table.TaskID;
            var workflowID = $("#DrpTaskWorkflowInstance").val();
            var rolemodal = $('#TaskEditModal');
            var PostUrl = WebURL + "WorkflowInstance/EditTask";
            $.ajax({
                type: 'GET',  // http method
                url: PostUrl,
                data: { taskID: taskID, workflowID: workflowID },  // data to submit                    
                success: function (data, status, xhr) {
                    $(".TaskEditModalBody").html('');
                    $(".TaskEditModalBody").html(data);
                    $("#txtWFITaskName,#ddlWFITaskTemplate,#ddlWFITaskStatus,#txtWFITaskDuration,#txtWFITaskStartDate,#txtWFITaskEndDate,#ddlTaskResponsibility,#Taskflag,#IsReviewRequired,#ddlTaskReviewResource,#txtWFIReviewResponsibility,#txtWFITaskNotes").prop("disabled", true);
                    $("#calender-box-2").addClass("calender-box-3");
                    $("#calender-box-5").addClass("calender-box-4");
                }
            });
            rolemodal.modal('show');
        });
        this.sortTaskGrid({ id: 'TasksViewgrid', url: '/WorkflowEnduser/GetTaskSearchRecords' });
    },

    searchGrid: function (args) {
        var table = $('#' + args.id).DataTable();
        table.columns().every(function () {
            var that = this;
            $('input', this.footer()).on('keyup change', function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var table = $('#TasksViewgrid').DataTable();
                var key = e.which;
                if (key === 9 || key === 16) {
                    return false;
                }
                var txtTaskName = $('#txtTaskNameSearchField').val();
                var txtResponsibility = $('#txtResponsibilitySearchField').val();
                var txtAssignee = $('#txtAssigneeSearchField').val();
                var txtStatus = $('#txtWorkflowStatusSearchField').val();
                var txtStartDate = $("#txtStartDateSearchField").val();
                var txtEndDate = $("#txtEndDateSearchField").val();

                url = args.url;
                SearchColumnName = $(this).parent().parent().data('headername');
                if (SearchColumnName === "Task name" || SearchColumnName === "Responsibility" || SearchColumnName === "Assignee" || SearchColumnName === "Status" || SearchColumnName === "Start date" || SearchColumnName === "End date") {
                    SearchString = [txtTaskName, txtResponsibility, txtAssignee, txtStatus, txtStartDate, txtEndDate];
                } else {
                    SearchString = this.value;
                }

                if (SearchColumnName === "Start date" || SearchColumnName === "End date") {
                    $('.datepicker').hide();
                }

                var WorkspaceID = $("#DrpTaskWorkspaceInstance").val();
                var WorkItemID = $("#DrpTaskWorkitemInstance").val();
                var WorkflowID = $("#DrpTaskWorkflowInstance").val();

                var params = { searchColumnName: SearchColumnName, sSearchString: SearchString, workspaceID: WorkspaceID, workItemID: WorkItemID, workflowID: WorkflowID };
                var Searchdata;
                $.post(url, params, function (data) {
                    Searchdata = data;
                    recordsearch = "Performed";
                    table.clear().rows.add(Searchdata).draw();
                });
            });
        });
    },

    sortTaskGrid: function (args) {
        $('#TasksViewgrid th').click(function (e) {
            if ($(this).hasClass("sortheader")) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var colIndex = $(this).index();
                var currentElement = $(this).attr('id');
                var sortOrder;
                if (currentElement !== null && currentElement !== "") {
                    if ($(this).hasClass("sorti_desc")) {
                        sortOrder = "asc";
                    }
                    else if ($(this).hasClass("sorti_asc")) {
                        sortOrder = "desc";
                    }
                    else {
                        sortOrder = "asc";
                    }
                    sortByTaskColumns(colIndex, sortOrder);
                    if (sortOrder === "asc") {
                        $("#" + currentElement).addClass("sorti_asc");
                        $("#" + currentElement).removeClass("sorti_desc");
                    }
                    else if (sortOrder === "desc") {
                        $("#" + currentElement).addClass("sorti_desc");
                        $("#" + currentElement).removeClass("sorti_asc");
                    }
                }
            }
        });
    }
};
/*************************************************End of Tasks Section***************************************/

//Used for Tasks
$(document).ready(function (e) {
    $("#DrpTaskWorkspaceInstance").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#TasksViewgrid').DataTable();
        table.clear();
        table.draw();
        var defaultOption = "<option selected='selected' value='-1'>--Please select--</option>";
        $("#DrpTaskWorkitemInstance").empty();
        $("#DrpTaskWorkitemInstance").prepend(defaultOption);
        $("#DrpTaskWorkflowInstance").empty();
        $("#DrpTaskWorkflowInstance").prepend(defaultOption);
        var selectedIndex = $('#DrpTaskWorkspaceInstance option:selected').index();
        if (selectedIndex > 0) {
            $.post('GetWorkitemInstanceList', { workspaceID: $("#DrpTaskWorkspaceInstance").val() }, function (data, status) {
                if (status === 'success') {
                    if (data.length > 0) {
                        $.each(data, function (i, state) {
                            $("#DrpTaskWorkitemInstance").append('<option value="' + data[i].value + '">' +
                                data[i].text + '</option>');
                        });
                    }
                }
            });
        }
    });

    $("#DrpTaskWorkitemInstance").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#TasksViewgrid').DataTable();
        table.clear();
        table.draw();
        $("#DrpTaskWorkflowInstance").empty();
        var defaultOption = "<option selected='selected' value='-1'>--Please select--</option>";
        $("#DrpTaskWorkflowInstance").prepend(defaultOption);
        var selectedIndex = $('#DrpTaskWorkitemInstance option:selected').index();
        if (selectedIndex > 0) {
            $.post('GetWorkflowInstanceList', { workspaceID: $("#DrpTaskWorkspaceInstance").val(), workItemID: $("#DrpTaskWorkitemInstance").val() }, function (data, status) {
                if (status === 'success') {
                    if (data.length > 0) {
                        $.each(data, function (i, state) {
                            $("#DrpTaskWorkflowInstance").append('<option value="' + data[i].value + '">' +
                                data[i].text + '</option>');
                        });
                    }
                }
            });
        }
    });

    $("#DrpTaskWorkflowInstance").change(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var table = $('#TasksViewgrid').DataTable();
        var selectedIndex = $('#DrpTaskWorkflowInstance option:selected').index();
        if (selectedIndex > 0) {
            $.post('GetTaskView', { workspaceID: $("#DrpTaskWorkspaceInstance").val(), workItemID: $("#DrpTaskWorkitemInstance").val(), workflowID: $("#DrpTaskWorkflowInstance").val() }, function (data, status, row) {
                if (status === 'success') {
                    var Searchdata;
                    if (data.length > 0) {
                        Searchdata = data;
                        table.clear().rows.add(Searchdata).draw();
                    } else {
                        table.clear();
                        table.draw();
                    }
                }
            });
        } else {
            table.clear();
            table.draw();
        }
    });

    $('#btnTaskBack').on('click', function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var WorkspaceId = $("#hdnWorkspaceofTask").val();
        var WorkitemId = $("#hdnWorkitemofTask").val();
        var url = "WorkflowEndUser/ViewWorkflow?workspaceID=" + WorkspaceId + "&workItemID=" + WorkitemId;
        window.location.href = WebURL + url;
    });
});


function sortByWorkflowColumns(colIndex, SortOrder) {
    var table = $('#WorkflowViewgrid').DataTable();
    var params = { OrderByColumn: colIndex, OrderBydirection: SortOrder };
    var colindex = parseInt(colIndex);
    if (colindex === 1) {
        colindex = 10;
    }
    table.order([colindex, SortOrder])
        .draw();
}
function sortByWorkItemColumns(colIndex, SortOrder) {
    var table = $('#WorkitemViewgrid').DataTable();
    var params = { OrderByColumn: colIndex, OrderBydirection: SortOrder };
    var colindex = parseInt(colIndex);
    if (colindex === 1) {
        colindex = 8;
    }
    table.order([colindex, SortOrder])
        .draw();
}
function sortByTaskColumns(colIndex, SortOrder) {
    var table = $('#TasksViewgrid').DataTable();
    var params = { OrderByColumn: colIndex, OrderBydirection: SortOrder };
    var colindex = parseInt(colIndex);
    if (colindex === 1) {
        colindex = 8;
    }
    table.order([colindex, SortOrder])
        .draw();
}
//function sortByTaskColumns(colIndex, SortOrder) {
//    var table = $('#TasksViewgrid').DataTable();
//    var params = { OrderByColumn: colIndex, OrderBydirection: SortOrder };
//    var colindex = parseInt(colIndex);
//    if (colindex === 1) {
//        colindex = 8;
//    }
//    table.order([colindex, SortOrder])
//        .draw();
//}
function btnUsersSaveEnable() {
    $('#btnwiretnusersave').attr("disabled", false);
    $("#btnwiretnusersave").css('cursor', 'pointer');
    $("#btnwiretnusersave").addClass('Button');
    $("#btnwiretnusersave").removeClass('Button-disable');
}
function btnUsersSaveDisable() {
    $('#btnwiretnusersave').attr("disabled", true);
    $("#btnwiretnusersave").css('cursor', 'not-allowed');
    $("#btnwiretnusersave").addClass('Button-disable');
    $("#btnwiretnusersave").removeClass('Button');
}
function btnFileSaveEnable() {
    $('#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory').addClass('Button');
    $('#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory').removeClass('Button-disable');
    $('#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory').attr("disabled", false);
    $("#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory").css('cursor', 'pointer');
}
function btnFileSaveDisable() {
    $('#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory').addClass('Button-disable');
    $('#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory').removeClass('Button');
    $('#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory').attr("disabled", true);
    $("#btnwiAddFileAttachment, #btnwiUpdateFileAttachment, #btnwiCreateFileAttachment, #btnwiUpdateFileAttachmentInMemory").css('cursor', 'not-allowed');
}
function loadFileAttachmentsGrid(FilesList, Mode) {
    var table = $('#WorkItemAttachmentGrid').dataTable({
        "stripeClasses": [],
        "destroy": true,
        "processing": false,
        //"serverSide": true,
        "orderMulti": false,
        "filter": false,
        "searching": false,
        "order": [[5, "asc"], [4, "desc"]],
        // this is for disable filter (search box)
        "language": {
            "emptyTable": function (FilesList) {
                if ((recordsearch === "Performed" && FilesList === 0) || (recordsearch === "Performed" && FilesList === "")) {
                    return Web_AttachmentCreateMsg;
                }
                else {
                    return Web_NoAttachmentsExists;
                }
            }
        },
        "createdRow": function (row, FilesList, dataIndex) {
            if (FilesList.IsAttachementFileOrURL !== "File") {
                $(row).find('.IsFileDownloadSelected').hide();
            }
        },
        "data": FilesList,
        "columns": [
            { "data": "", "name": "", "className": "col-md-1", "orderable": false },
            { "data": "AttachmentName", "name": "Attachment name", "className": "col-md-3 minwidth ", "orderable": true },
            { "data": "AttachmentType", "name": "Attachment type", "className": "col-md-3", "orderable": true },
            { "data": "IsAttachementFileOrURL", "name": "File/Link", "className": "col-md-1", "orderable": true },
            { "data": "Version", "name": "Version", "className": "col-md-1", "orderable": true },
            {
                "data": "FileCreatedDate", "name": "Last Updated On", "orderable": true, "type": "ce_datetime", "className": "col-md-2",
                render: function (FilesList, type, row) {
                    return moment.utc(FilesList.replace(/-/g, ' ')).format('DD-MMM-YYYY HH:mm'); //(moment.utc(data, 'YYYY-MM-DDTHH:mm:ssZ').format("DD-MMM-YYYY HH:mm"));
                }
            },
            { "data": "CreatedByName", "name": "User", "className": "col-md-2", "orderable": true },
            { "data": "Size", "name": "User", "className": "col-md-1", "orderable": true },
            {
                data: null,
                defaultContent: '',
                name: null,
                className: "col-md-1 text-center",
                orderable: false,
                render: {
                    display: function (data, type, row) {
                        return "<a title='Delete' style='cursor:pointer; color:red' class='DeleteWIFile'><span class='far Delete-icon'></span></a>&nbsp;&nbsp;&nbsp;&nbsp;<a title='Edit' style='cursor:pointer;' class='EditWIFile'><span class='far edit-img'></span></a>";
                    }
                }
            },
            { "data": "AttachmentURL", "name": "FileURL", "className": "hidden", "orderable": false }
        ],
        columnDefs: [
            {
                "targets": [0],
                render: function (data, type, row) {
                    if (data === true) {
                        return '<input type="checkbox" class ="IsFileDownloadSelected" name="id[]" checked value="' + data + '">';
                    }
                    else {
                        return '<input type="checkbox" class ="IsFileDownloadSelected Chkbox" name="id[]" value="' + data + '">';
                    }
                }
            },
            {
                "targets": [1],
                render: function (data, type, row) {
                    if (Mode === "CreateWorkItem") {
                        return '<span style="default: pointer;" class="tblWIAttachmentName">' + data + '</span>';
                    }
                    else {
                        return '<span style="cursor: pointer;" class="tblWIAttachmentName wiAttachmentNameDownload linkcolour">' + data + '</span>';
                    }
                }
            },
            {
                "targets": [3],
                render: function (data, type, row) {
                    return row.IsAttachementFileOrURL === "File" ? '<span class="aicon">F</span>' : '<span class="aicon">L</span>';
                }
            }
        ],
        "fnDrawCallback": function (oSettings) {
            WorkitemAttachmentPermissionMap();
        }
    });
    if (Mode == "CreateWorkItem") {
        var tbl = $('#WorkItemAttachmentGrid');
        tbl.DataTable().column(0).visible(false);
    }
}

var currentMode;
var WorkDaysList;
var WeekOffDays;
var KendoWeekOffDays;
var CustomValidFrom = null;
var CustomValidTo = null;
var CustomValidFromDate = null;
var CustomValidToDate = null;
var WIBillingRatesMasterData;
var isValidFrom = false;
var isValidTo = false;
var fromOnGridedit = null;
var WorkItemBillingrates = {
    init: function (args) {
        this.WebURL = args.Url;
        WebURL = this.WebURL;
        this.Mode = args.Mode;
        currentMode = this.Mode;
        if (workitemEndUser !== null && workitemEndUser.WorkItemInstance !== null) {
            workitemEndUser.WorkItemInstance.WorkItemBillingRates = args.WorkItemBillingrates;
        }
        $('#btnWIBillingRatesSave').prop('disabled', true);
        $('#btnWIBillingRatesSave').css("cursor", 'not-allowed');
        var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        if (billingratestype === "Local") {
            $(".LinkRefreshTaskList").css("pointer-events", "auto");
            $(".divrelatedworkitems").addClass("hide");
        } else {
            $(".LinkRefreshTaskList").css("pointer-events", "none");
            $(".divrelatedworkitems").removeClass("hide");
        }
        $(document).on('change', '#rbnWorkitemBillingRates', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var billingRateType = $(this).val();
            if (billingRateType === "Local") {
                $(".LinkRefreshTaskList").css("pointer-events", "auto");
                $(".divrelatedworkitems").addClass("hide");
                $("#ddlInheritedWorkItem").empty();
                $("#ddlInheritedWorkItem").append($("<option></option>").val("").html("--Please select--"));
            } else if (billingRateType === "Inherited") {
                $(".LinkRefreshTaskList").css("pointer-events", "none");
                BindRelatedWorkItems();
                $(".divrelatedworkitems").removeClass("hide");
            }
            GetTasksBillingrates();
            BillingRatesValidations();
        });
        $(document).on('change', '#ddlInheritedWorkItem', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
            var labelName = $(this).data('validatelabel');
            var CurrentId = $(this).attr('id');
            var varErrorClassName;
            if ($(this).hasClass('required') && billingratestype === "Inherited") {
                if ($('#' + CurrentId).val() === "" || $('#' + CurrentId).val() === 0) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
                }
                else {
                    $('.errmsg' + CurrentId).remove();
                }
            }
            BillingRatesValidations();
            GetTasksBillingrates();
        });
        $(document).on('change', '#ddlOverrideType', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var labelName = $(this).data('validatelabel');
            var CurrentId = $(this).attr('id');
            var varErrorClassName;
            if ($(this).hasClass('required')) {
                if ($('#' + CurrentId).val() === "" || $('#' + CurrentId).val() === 0) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
                }
                else {
                    $('.errmsg' + CurrentId).remove();
                }
                BillingRatesValidations();
            }
        });

        $(document).on('focusout', '#ddlOverrideType', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var labelName = $(this).data('validatelabel');
            var CurrentId = $(this).attr('id');
            var varErrorClassName;
            if ($(this).hasClass('required')) {
                if ($('#' + CurrentId).val() === "" || $('#' + CurrentId).val() === 0) {
                    $('.errmsg' + CurrentId).remove();
                    varErrorClassName = 'errmsg' + CurrentId;
                    $('#' + CurrentId).after('<span class="text-danger ' + varErrorClassName + '">' + Web_IsRequired.replace("{0}", labelName) + '</span>');
                }
                else {
                    $('.errmsg' + CurrentId).remove();
                }
                BillingRatesValidations();
            }
        });

        function BindRelatedWorkItems() {
            $("#ddlInheritedWorkItem").empty();
            $("#ddlInheritedWorkItem").append($("<option></option>").val("").html("--Please select--"));
            if (workitemEndUser !== null && workitemEndUser.WorkItemInstance !== null) {
                if (workitemEndUser.WorkItemInstance.WorkItemBillingRates !== null) {
                    if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist !== null) {
                        $("#ddlInheritedWorkItem").empty();
                        $("#ddlInheritedWorkItem").append($("<option></option>").val("").html("--Please select--"));
                        for (wirel = 0; wirel < workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist.length; wirel++) {
                            if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Relationship === "Parent"
                                && workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Status === true) {
                                $("#ddlInheritedWorkItem").append($("<option></option>").val(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ParentWorkItemInstanceID).html(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].RelatedWorkItems));
                                if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ParentWorkItemInstanceID === workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID) {
                                    $("#ddlInheritedWorkItem").val(workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID);
                                }
                            } else if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Relationship === "Child"
                                && workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].Status === true) {
                                $("#ddlInheritedWorkItem").append($("<option></option>").val(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ChildWorkItemInstanceID).html(workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].RelatedWorkItems));
                                if (workitemEndUser.WorkItemInstance.wirelatedWIInstanceslist[wirel].ChildWorkItemInstanceID === workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID) {
                                    $("#ddlInheritedWorkItem").val(workitemEndUser.WorkItemInstance.WorkItemBillingRates.InheritedWorkItemID);
                                }
                            }
                        }
                    }
                }
            }
        }

        function GetTasksBillingrates() {
            var BillingRateType = $('input[name=LocalOrInheritedWorkItem]:checked').val();
            var params = { billingRateType: BillingRateType, workItemInstanceID: $("#ddlInheritedWorkItem").val() };
            $.ajax({
                url: WebURL + "WorkitemEnduser/GetTasksBillingrates",
                type: "POST",
                data: params,
                success: function (data) {
                    $(".divWIbillingrates").html("");
                    $(".divWIbillingrates").html(data);
                }
            });
        }
        this.LoadWorkItemBillingRates(workitemEndUser.WorkItemInstance.WorkItemBillingRates);
        BillingRatesValidations();
        function BillingRatesValidations() {
            var IsValid = true;
            var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
            if (billingratestype === "Inherited" && $("#ddlInheritedWorkItem").val() === "") {
                IsValid = false;
            } else if ($("#ddlOverrideType").val() === "" || $("#ddlOverrideType").val() === 0) {
                IsValid = false;
            }
            if (!IsValid) {
                $("#btnwiInsatnceSave").prop("disabled", true);
                $("#btnwiInsatnceSave").css('cursor', 'not-allowed');
                $("#btnwiEditSave").prop("disabled", true);
                $("#btnwiEditSave").css('cursor', 'not-allowed');
                $("#btnwiEditSave").addClass('Button-disable');
                $("#btnwiEditSave").removeClass('Button');
                //$("#btnwiInsatnceSave").addClass('Button-disable');
                //$("#btnwiInsatnceSave").removeClass('Button');

            } else {
                $("#btnwiInsatnceSave").prop("disabled", false);
                $("#btnwiInsatnceSave").css('cursor', 'pointer');
                $("#btnwiEditSave").prop("disabled", false);
                $("#btnwiEditSave").css('cursor', 'pointer');
                $("#btnwiEditSave").addClass('Button');
                $("#btnwiEditSave").removeClass('Button-disable');
                //$("#btnwiInsatnceSave").addClass('Button');
                //$("#btnwiInsatnceSave").removeClass('Button-disable');

            }
        }
        WorkDaysList = workitemEndUser.WorkItemInstance.WorkItemBillingRates.WorkDays;
        this.LoadWeekOffDays(WorkDaysList);
        $('.LinkRefreshTaskList').click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var params = { workItemTemplateID: $("#ddlwITemplate").val() };
            var PostUrl = WebUrl + "WorkitemEnduser/GetWorkflowTemplateTasks";
            $.ajax({
                type: 'GET',  // http method
                url: PostUrl,
                data: params,
                async: false,
                success: function (data) {
                    $(".divWIbillingrates").html("");
                    $(".divWIbillingrates").html(data);
                }
            });
        });
        $(".closeWIhistoryrecords").click(function () {
            $(".divWIbillingrateshistory").addClass("hide");
            $(".closeWIhistoryrecords").addClass("hide");
            $(".LinkViewWIChangeHistory").css("pointer-events", "auto");
        });
        $('.LinkViewWIChangeHistory').click(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            $(this).css("pointer-events", "none");
            $(".divWIbillingrateshistory").removeClass("hide");
            $(".closeWIhistoryrecords").removeClass("hide");
            $("#WorkItem_BillingRates_History").kendoGrid({
                columns: [
                    { field: "WorkItemBillingRatesHistoryID", hidden: true },
                    { field: "WorkItemBillingRatesID", title: "Billing rate id" },
                    { field: "TaskTemplateName", title: "Task template" },
                    { field: "Rate", title: "Rate", template: '#= Rate!=0 ? Rate: " " #' },
                    { field: "Currency", title: "Currency" },
                    { field: "UnitOfMeasure", title: "Unit of measure", width: 120 },
                    { field: "Complexity", title: "Complexity" },
                    { field: "ValidFrom", title: "Valid from", format: "{0:dd-MMM-yyyy}", type: "date", template: '#= (ValidFrom!=null) ? kendo.toString(ValidFrom, "dd-MMM-yyyy"): " " #' },
                    { field: "ValidTo", title: "valid to", format: "{0:dd-MMM-yyyy}", type: "date", template: '#= (ValidTo!=null) ? kendo.toString(ValidTo, "dd-MMM-yyyy"): " " #' }
                ],
                dataSource: {
                    transport: {
                        read: function (options) {
                            $.ajax({
                                //this is called everytime the datasource is refreshed or reloaded
                                url: WebURL + "WorkitemEndUser/GetWIBillingRatesHistory",
                                dataType: "json",
                                type: "GET",
                                success: function (result) {
                                    // notify the data source that the request succeeded
                                    options.success(result);
                                },
                                error: function (result) {
                                    // notify the data source that the request failed
                                    options.error(result);
                                }
                            });
                        },
                        schema: {
                            model: { id: "WorkItemBillingRatesID" }
                        }
                    },
                    pageSize: 5,
                    group: { field: "WorkItemBillingRatesID" }
                },
                groupable: false,
                sortable: true,
                pageable: true,
                dataBound: onHistoryDatabound
            });
        });
        function onHistoryDatabound() {
            if (this.dataSource.view().length === 0) {
                $('.k-pager-info').hide();
            }
            DisplayNoHisoryFound($('#WorkItem_BillingRates_History'));
        }
        function DisplayNoHisoryFound(grid) {
            // Get the number of Columns in the grid
            var dataSource = grid.data("kendoGrid").dataSource;
            var colCount = grid.find('.k-grid-header colgroup > col').length;
            // If there are no results place an indicator row
            if (dataSource._view.length === 0) {
                grid.find('.k-grid-content tbody')
                    .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" style="text-align:center">' + Web_NohistoryRecordsfoundforBillingRatesforWI + '</td></tr>');
            }
            // Get visible row count
            var rowCount = grid.find('.k-grid-content tbody tr').length;
            // If the row count is less that the page size add in the number of missing rows
            if (rowCount < dataSource._take) {
                var addRows = dataSource._take - rowCount;
                for (var i = 0; i < addRows; i++) {
                    grid.find('.k-grid-content tbody').append('<tr class="kendo-data-row"><td>&nbsp;</td></tr>');
                }
            }
        }
    },
    LoadWorkItemBillingRates: function (Model) {
        var model = Model;
        var crudServiceBaseUrl = WebURL;
        var workItemBillingRatesDataSource = new kendo.data.DataSource({
            transport: {
                read: function (options) {
                    $.ajax({
                        //this is called everytime the datasource is refreshed or reloaded
                        url: crudServiceBaseUrl + "WorkitemEnduser/GetWorkItemTaskBillingRates",
                        dataType: "json",
                        type: "GET",
                        success: function (result) {
                            // notify the data source that the request succeeded
                            options.success(result);
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            options.error(result);
                        }
                    });
                },
                create: function (options) {
                    if (isValidFrom === true) {
                        options.data.models[0].ValidFrom = null;
                    }
                    if (isValidTo === true) {
                        options.data.models[0].ValidTo = null;
                    }
                    if (options.data.models[0].ValidFrom !== null) {
                        var hrs = options.data.models[0].ValidFrom.getHours() - options.data.models[0].ValidFrom.getTimezoneOffset() / 60;
                        var mins = (options.data.models[0].ValidFrom.getHours() - options.data.models[0].ValidFrom.getTimezoneOffset()) % 60;
                        options.data.models[0].ValidFrom.setHours(hrs);
                        options.data.models[0].ValidFrom.setMinutes(mins);
                    }
                    if (options.data.models[0].ValidTo !== null) {
                        var thrs = options.data.models[0].ValidTo.getHours() - options.data.models[0].ValidTo.getTimezoneOffset() / 60;
                        var tmins = (options.data.models[0].ValidTo.getHours() - options.data.models[0].ValidTo.getTimezoneOffset()) % 60;
                        options.data.models[0].ValidTo.setHours(thrs);
                        options.data.models[0].ValidTo.setMinutes(tmins);
                    }
                    $.ajax({
                        //this is called for each update on the Gantt chart 
                        url: crudServiceBaseUrl + "WorkitemEnduser/CreateWorkItemTaskBillingRate",
                        dataType: "json",
                        type: "POST",
                        data: {
                            models: kendo.stringify(options.data.models)
                        },
                        success: function (result) {
                            // notify the data source that the request succeeded
                            options.success(result);
                            var grid = $("#WorkItem_BillingRates").data("kendoGrid");
                            if (grid) {
                                grid.dataSource.read();
                            }
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            options.error(result);
                            var grid = $("#WorkItem_BillingRates").data("kendoGrid");
                            if (grid) {
                                grid.dataSource.read();
                            }
                        }
                    });
                },
                update: function (options) {
                    if (options.data.models[0].ValidFrom !== null) {
                        var hrs = options.data.models[0].ValidFrom.getHours() - options.data.models[0].ValidFrom.getTimezoneOffset() / 60;
                        var mins = (options.data.models[0].ValidFrom.getHours() - options.data.models[0].ValidFrom.getTimezoneOffset()) % 60;
                        options.data.models[0].ValidFrom.setHours(hrs);
                        options.data.models[0].ValidFrom.setMinutes(mins);
                    }
                    if (options.data.models[0].ValidTo !== null) {
                        var thrs = options.data.models[0].ValidTo.getHours() - options.data.models[0].ValidTo.getTimezoneOffset() / 60;
                        var tmins = (options.data.models[0].ValidTo.getHours() - options.data.models[0].ValidTo.getTimezoneOffset()) % 60;
                        options.data.models[0].ValidTo.setHours(thrs);
                        options.data.models[0].ValidTo.setMinutes(tmins);
                    }
                    $.ajax({
                        //this is called for update click
                        url: crudServiceBaseUrl + "WorkitemEnduser/UpdateWorkItemTaskBillingRate",
                        dataType: "json",
                        type: "POST",
                        data: {
                            models: kendo.stringify(options.data.models)
                        },
                        success: function (result) {
                            // notify the data source that the request succeeded
                            options.success(result);
                            var grid = $("#WorkItem_BillingRates").data("kendoGrid");
                            if (grid) {
                                grid.dataSource.read();
                            }
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            options.error(result);
                            var grid = $("#WorkItem_BillingRates").data("kendoGrid");
                            if (grid) {
                                grid.dataSource.read();
                            }
                        }
                    });
                },
                destroy: function (options) {
                    $.ajax({
                        //this is called for update click
                        url: crudServiceBaseUrl + "WorkitemEnduser/DeleteWorkItemTaskBillingRate",
                        dataType: "json",
                        type: "POST",
                        data: {
                            models: kendo.stringify(options.data.models)
                        },
                        success: function (result) {
                            // notify the data source that the request succeeded
                            options.success(result);
                            var grid = $("#WorkItem_BillingRates").data("kendoGrid");
                            if (grid) {
                                grid.dataSource.read();
                                //EnableDisableResponsibilities(result);
                            }
                        },
                        error: function (result) {
                            // notify the data source that the request failed
                            options.error(result);
                            var grid = $("#WorkItem_BillingRates").data("kendoGrid");
                            if (grid) {
                                grid.dataSource.read();
                            }
                        }
                    });
                },
                parameterMap: function (options, operation) {
                    if (operation !== "read" && options.models) {
                        return { models: kendo.stringify(options.models) };
                    }
                }
            },
            batch: true,
            pageSize: 5,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { from: "RowID", type: "number" },
                        WorkItemBillingRatesID: { from: "WorkItemBillingRatesID", type: "number", defaultvalue: "", editable: false },
                        AssignedWorkflowTemplateID: { from: "AssignedWorkflowTemplateID", type: "number", defaultvalue: "" },
                        AssignedWorkflowTemplateName: { from: "AssignedWorkflowTemplateName", type: "string", defaultvalue: "" },
                        AssignedTaskTemplateID: { from: "AssignedTaskTemplateID", type: "number", defaultvalue: "" },
                        AssignedTaskTemplateName: {
                            from: "AssignedTaskTemplateName", type: "string", defaultvalue: "",
                            validation: {
                                required: true,
                                customTaskTemplateValidation: function (input) {
                                    if (input.attr("data-bind") === "value:AssignedTaskTemplateName" && (input.val() === "--Please select--" || input.val() === "0")) {
                                        //input.attr("data-customUnitOfMeasureValidation-msg", Web_UnitOfMeasurementIsRequired);
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        },
                        AssignedUnitOfMeaureID: { from: "AssignedUnitOfMeaureID", type: "number", defaultvalue: "" },
                        AssignedUnitOfMeaureName: {
                            from: "AssignedUnitOfMeaureName", type: "string", defaultvalue: "",
                            validation: {
                                required: true,
                                customUnitOfMeasureValidation: function (input) {
                                    if (input.attr("data-bind") === "value:AssignedUnitOfMeaureName" && (input.val() === "--Please select--" || input.val() === "0")) {
                                        //input.attr("data-customUnitOfMeasureValidation-msg", Web_UnitOfMeasurementIsRequired);
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        },
                        AssignedCurrencyID: { from: "AssignedCurrencyID", type: "number", defaultvalue: "" },
                        AssignedCurrencyName: {
                            from: "AssignedCurrencyName", type: "string", defaultvalue: "",
                            validation: {
                                required: true,
                                customCurrencyValidation: function (input) {
                                    if (input.attr("data-bind") === "value:AssignedCurrencyName" && (input.val() === "--Please select--" || input.val() === "0")) {
                                        //input.attr("data-customCurrencyValidation-msg", Web_CurrencyIsRequired);
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        },
                        AssignedComplexityID: { from: "AssignedComplexityID", type: "number", defaultvalue: "" },
                        AssignedComplexityName: {
                            from: "AssignedComplexityName", type: "string", defaultvalue: "",
                            validation: {
                                required: true,
                                customComplexityValidation: function (input) {
                                    if (input.attr("data-bind") === "value:AssignedComplexityName" && (input.val() === "--Please select--" || input.val() === "0")) {
                                        //input.attr("data-customComplexityValidation-msg", Web_ComplexityIsRequired);
                                        return false;
                                    }
                                    return true;
                                }
                            }
                        },
                        Rate: {
                            from: "Rate", type: "number",
                            validation: {
                                required: true,
                                rateValidation: function (input) {
                                    if (input.attr("data-bind") === "value:Rate") {
                                        if (input.val() === "0.00" || input.val() === "0" || input.val() === "") {
                                            //input.attr("data-rateValidation-msg", Web_RateIsRequired);
                                            return false;
                                        }
                                        else if (input.val() < 0) {
                                            //input.attr("data-rateValidation-msg", Web_RateIsRequired);
                                            return false;
                                        }
                                        else if (input.val() >= 10000000000) {
                                            //input.attr("data-rateValidation-msg", Web_MaximumRate);
                                            var message = Web_MaximumRate;
                                            $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                                            $('.WIBillingRatesGridErrorMsg').html(message);
                                            window.scrollTo(0, 0);
                                            setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
                                            return false;
                                        }
                                    }
                                    return true;
                                }
                            }
                        },
                        ValidFrom: {
                            from: "ValidFrom", type: "date",
                            validation: {
                                required: true,
                                customValidFromValidation: function (input) {
                                    if (input.attr("data-bind") === "value: ValidFrom") {
                                        CustomValidFrom = input;
                                        CustomValidFromDate = input.val();
                                        if (input.val() === "") {
                                            isValidFrom = true;
                                        }
                                        else {
                                            isValidFrom = false;
                                        }
                                    }
                                    return true;
                                }
                            }
                        },
                        ValidTo: {
                            from: "ValidTo", type: "date",
                            validation: {
                                required: true,
                                customValidToValidation: function (input) {
                                    if (input.attr("data-bind") === "value: ValidTo") {
                                        CustomValidTo = input;
                                        CustomValidToDate = input.val();
                                        if (input.val() === "") {
                                            isValidTo = true;
                                        }
                                        else {
                                            isValidTo = false;
                                        }
                                    }
                                    if (CustomValidFrom !== null && CustomValidTo !== null) {
                                        if (CustomValidFromDate === null || CustomValidFromDate === "" &&
                                            CustomValidToDate !== null && CustomValidToDate !== "") {
                                            CustomValidFrom.parent().addClass('k-invalid');
                                        }
                                    }
                                    return true;
                                }
                            }
                        },
                        IsMasterTask: { from: "WorkflowTaskTemplateID", type: "boolean" },
                        DbOperation: { from: "DbOperation", type: "string" }
                    }
                }
            }
        });

        var grid1 = $("#WorkItem_BillingRates").kendoGrid({
            dataSource: workItemBillingRatesDataSource,
            pageable: true,
            height: 500,
            toolbar: ["create"],
            //toolbar: [
            //    {
            //        // Own version of "Add new record" button, with name **popup**
            //        text: "Create billing rate entry",
            //        //name: "popup",
            //        iconClass: "k-icon k-i-plus"
            //    }
            //],
            sortable: true,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        contains: "Contains"
                    }
                }
            },
            columns: [
                { field: "id", hidden: true },
                { field: "IsMasterTask", hidden: true },
                { field: "WorkItemBillingRatesID", width: 80, title: "ID", template: '#= (WorkItemBillingRatesID!=0&&WorkItemBillingRatesID!=null) ? WorkItemBillingRatesID: " " #' },
                //{ field: "AssignedWorkflowTemplateName", width: 180, title: "Workflow template", editor: WorkflowTemplateEditor, template: "#= AssignedWorkflowTemplateName #" },
                { field: "AssignedWorkflowTemplateName", width: 180, title: "Workflow template", editor: WorkflowTemplateEditor, template: '#= AssignedWorkflowTemplateName!=0 ? AssignedWorkflowTemplateName: " " #' },
                { field: "AssignedTaskTemplateName", title: "Task template", width: 300, editor: TaskTemplateEditor, template: "#= AssignedTaskTemplateName #" },
                { field: "Rate", title: "Rate", width: 200, template: '#= Rate!=0 ? Rate: " " #' },
                { field: "AssignedCurrencyName", title: "Currency", width: 150, editor: CurrencyEditor, template: "#= AssignedCurrencyName #" },
                { field: "AssignedUnitOfMeaureName", title: "Unit of measure", width: 160, editor: UnitOfMeasureEditor, template: "#= AssignedUnitOfMeaureName #" },
                { field: "AssignedComplexityName", title: "Complexity", width: 150, editor: ComplexityEditor, template: "#= AssignedComplexityName #" },
                { field: "ValidFrom", title: "Valid from", format: "{0:dd-MMM-yyyy}", width: 150, editor: ValidFromEditor, template: '#= (ValidFrom!=null) ? kendo.toString(ValidFrom, "dd-MMM-yyyy"): " " #' },
                { field: "ValidTo", title: "Valid to", format: "{0:dd-MMM-yyyy}", width: 150, editor: ValidToEditor, template: '#= (ValidTo!=null) ? kendo.toString(ValidTo, "dd-MMM-yyyy"): " " #' },
                {
                    command: [
                        { name: "edit", text: { edit: "", update: "", cancel: "" } },
                        { name: "destroy", text: "" }
                    ], title: "Actions", width: "100px"
                }],
            edit: onGridEdit,
            editable: {
                mode: "inline", "createAt": "bottom", // mode can be incell/inline/popup with Q1 '12 Beta Release of Kendo UI
                confirmation: false // the confirmation message for destroy command - we can use this for cutomization
            },
            save: onSave,
            dataBound: onDataBound
        });

        $(".k-grid-popup", grid1.element).on("click", function () {
            $("#ddlTaskTemplate").val('');
            var taskModal = $('#WIBillingRatesModal');
            taskModal.modal('show');
        });

        // prevent sorting/filtering while any Grid is being edited
        $(".k-grid").on("mousedown", ".k-grid-header th, .k-button:not('.k-grid-cancel,.k-grid-update')", function (e) {
            var grid = $(this).closest(".k-grid");
            var editRow = grid.find(".k-grid-edit-row");
            if (editRow.length > 0) {
                message = Web_SaveCancelResponsibility;
                $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                $('.WIBillingRatesGridErrorMsg').html(message);
                window.scrollTo(0, 0);
                setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
                e.preventDefault();
            }
        });

        //hiding column and add button dynamically.
        var grid = $("#WorkItem_BillingRates").data("kendoGrid");
        //if (currentMode === "CreateWorkItem") {
        //    //$('.k-icon, .k-i-plus').css("visibility", "hidden");
        //    $('.k-icon, .k-i-plus').css("display", "none");
        //    $('.k-grid .k-header .k-button').css("visibility", "hidden");
        //}
        var billingratestype = $('input[name=LocalOrInheritedWorkItem]:checked').val();
        if (billingratestype === "Inherited") {
            $('.k-icon, .k-i-plus').css("display", "none");
            $('.k-grid .k-header .k-button').css("visibility", "hidden");
            grid.hideColumn(11);
        }

        function onGridEdit(arg) {
            var params = { workItemTemplateID: $("#ddlwITemplate").val() };
            $.ajax("/WorkitemEnduser/BindWIBillingRatesMasterData", {
                dataType: "json",
                type: 'POST',
                data: params,
                success: function (result) {
                    WIBillingRatesMasterData = result;
                    var workflowTemplateDDL = $(arg.container).find("select[name^='AssignedWorkflowTemplateName']");
                    var workflowTemplates = result.WorkflowTemplateList;
                    $('<option value="0">--Please select--</option>').appendTo(workflowTemplateDDL);
                    $.each(workflowTemplates, function (i, state) {
                        $('<option value="' + workflowTemplates[i].Text + '">' +
                            workflowTemplates[i].Text + '</option>').appendTo(workflowTemplateDDL);
                    });
                    $(workflowTemplateDDL).kendoDropDownList({});

                    var taskTemplateDDL = $(arg.container).find("select[name^='AssignedTaskTemplateName']");
                    $(taskTemplateDDL).empty();
                    $('<option value="0">--Please select--</option>').appendTo(taskTemplateDDL);
                    var workflowTemplateName = $(arg.container).find("select[name^='AssignedWorkflowTemplateName']").data("kendoDropDownList").value();
                    if (workflowTemplateName !== "" && workflowTemplateName !== null) {
                        var workflowTemplateID = "0";
                        var workflowTemplateList = WIBillingRatesMasterData.WorkflowTemplateList;
                        $.each(workflowTemplateList, function (i, state) {
                            if (workflowTemplateList[i].Text === workflowTemplateName) {
                                workflowTemplateID = workflowTemplateList[i].Value;
                            }
                        });
                        var params = { workflowTemplateID: workflowTemplateID };
                        $.ajax({
                            //this is called everytime the datasource is refreshed or reloaded
                            url: WebURL + "WorkitemEnduser/GetWorkflowTemplateTasksByWorkflowTemplateID",
                            dataType: "json",
                            type: "POST",
                            data: params,
                            success: function (workflowTaskTemplates) {
                                $.each(workflowTaskTemplates, function (i, state) {
                                    $('<option value="' + workflowTaskTemplates[i].Text + '">' +
                                        workflowTaskTemplates[i].Text + '</option>').appendTo(taskTemplateDDL);
                                });
                                $(taskTemplateDDL).kendoDropDownList({});
                            }
                        });
                    } else {
                        var taskTemplates = result.TaskTemplateList;
                        $.each(taskTemplates, function (i, state) {
                            $('<option value="' + taskTemplates[i].Text + '">' +
                                taskTemplates[i].Text + '</option>').appendTo(taskTemplateDDL);
                        });
                        $(taskTemplateDDL).kendoDropDownList({});
                    }

                    var unitOfMeasureDDL = $(arg.container).find("select[name^='AssignedUnitOfMeaureName']");
                    var unitOfMeasures = result.UnitOfMeasureList;
                    $('<option value="0">--Please select--</option>').appendTo(unitOfMeasureDDL);
                    $.each(unitOfMeasures, function (i, state) {
                        $('<option value="' + unitOfMeasures[i].Text + '">' +
                            unitOfMeasures[i].Text + '</option>').appendTo(unitOfMeasureDDL);
                    });
                    $(unitOfMeasureDDL).kendoDropDownList({});

                    var CurrencyDDL = $(arg.container).find("select[name^='AssignedCurrencyName']");
                    var currencies = result.CurrencyList;
                    $('<option value="0">--Please select--</option>').appendTo(CurrencyDDL);
                    $.each(currencies, function (i, state) {
                        $('<option value="' + currencies[i].Text + '">' +
                            currencies[i].Text + '</option>').appendTo(CurrencyDDL);
                    });
                    $(CurrencyDDL).kendoDropDownList({});

                    var ComplexityDDL = $(arg.container).find("select[name^='AssignedComplexityName']");
                    var complexities = result.ComplexityList;
                    $('<option value="0">0</option>').appendTo(ComplexityDDL);
                    $.each(complexities, function (i, state) {
                        $('<option value="' + complexities[i].Text + '">' +
                            complexities[i].Text + '</option>').appendTo(ComplexityDDL);
                    });
                    $(ComplexityDDL).kendoDropDownList({});

                    if ($(arg.container).find("select[name^='AssignedWorkflowTemplateName']").data("kendoDropDownList").value() === "") {
                        $(arg.container).find("select[name^='AssignedWorkflowTemplateName']").data("kendoDropDownList").value("0");
                    }
                    if ($(arg.container).find("select[name^='AssignedTaskTemplateName']").data("kendoDropDownList").value() === ""
                        || $(arg.container).find("select[name^='AssignedTaskTemplateName']").data("kendoDropDownList").value() === "0") {
                        $(arg.container).find("select[name^='AssignedTaskTemplateName']").data("kendoDropDownList").value("0");
                    }
                    if ($(arg.container).find("select[name^='AssignedUnitOfMeaureName']").data("kendoDropDownList").value() === "") {
                        $(arg.container).find("select[name^='AssignedUnitOfMeaureName']").data("kendoDropDownList").value("0");
                    }
                    if ($(arg.container).find("select[name^='AssignedCurrencyName']").data("kendoDropDownList").value() === "") {
                        $(arg.container).find("select[name^='AssignedCurrencyName']").data("kendoDropDownList").value("0");
                    }
                    if ($(arg.container).find("select[name^='AssignedComplexityName']").data("kendoDropDownList").value() === "") {
                        $(arg.container).find("select[name^='AssignedComplexityName']").data("kendoDropDownList").value("0");
                    }
                    var txtRate = $(arg.container).find("input[name=Rate]");
                    destroyNumeric(txtRate);
                    $(txtRate).kendoNumericTextBox({
                        decimals: 8,
                        round: false,
                        step: 0.00000001,
                        format: "{0:0.00000000}"
                    });

                    if (arg.model.isNew()) {
                        $(arg.container).find("input[name=ValidFrom]").data("kendoDatePicker").value("");
                        $(arg.container).find("input[name=ValidTo]").data("kendoDatePicker").value("");
                        fromOnGridedit = "NEW"
                    } else {
                        fromOnGridedit = "EDIT"
                    }

                    arg.container.find(".k-grid-cancel").bind("click", function () {
                        $(".k-grid-edit").attr("title", "Edit");
                        $('.k-grid-edit, k-i-edit, .k-grid-actions').prop('disabled', false);
                        $('.k-grid-edit, k-i-edit, .k-grid-actions').css('cursor', 'pointer');
                        $(".k-grid-header th.k-header").css('pointer-events', 'auto');
                        $(".k-grid-edit").prop('disabled', false);
                        $('.k-pager-wrap').css('pointer-events', 'auto');
                        //$("#WForBTaskTemplateID").val(null);
                    });

                    $(".k-grid-update").attr("title", "Save");
                    $(".k-grid-cancel").attr("title", "Cancel");
                    $(".k-grid-header th.k-header").css('pointer-events', 'none');
                    $(".k-grid-edit").prop('disabled', true);
                    $('.k-pager-wrap').css('pointer-events', 'none');
                }
            });
        }

        function destroyNumeric(txtRate) {
            var numeric = $(txtRate).data("kendoNumericTextBox");
            var origin = numeric.element.show();
            origin.insertAfter(numeric.wrapper);
            numeric.destroy();
            numeric.wrapper.remove();
        }

        function WorkflowTemplateEditor(container, options) {
            var dropdownHtml = $("<select data-role='dropdownlist' name='AssignedWorkflowTemplateName' id='ddlWorkflowTemplate" + options.model.id + "' style='width: 100%'/>");
            var ddlworkflowTemplate = $(dropdownHtml)
                .appendTo(container)
                .kendoDropDownList({});
            ddlworkflowTemplate.change(function () {
                //$("#WForBTaskTemplateID").val(null);
                var taskTemplateDDL = $('#WorkItem_BillingRates').find("select[name^='AssignedTaskTemplateName']");
                $(taskTemplateDDL).empty();
                var workflowTemplateName = $(this).val();
                var workflowTemplateID = "0";
                if (workflowTemplateName !== "0") {
                    var workflowTemplateList = WIBillingRatesMasterData.WorkflowTemplateList;
                    $.each(workflowTemplateList, function (i, state) {
                        if (workflowTemplateList[i].Text === workflowTemplateName) {
                            workflowTemplateID = workflowTemplateList[i].Value;
                        }
                    });
                    if (workflowTemplateID !== "0") {
                        var params = { workflowTemplateID: workflowTemplateID };
                        $.ajax({
                            //this is called everytime the datasource is refreshed or reloaded
                            url: WebURL + "WorkitemEnduser/GetWorkflowTemplateTasksByWorkflowTemplateID",
                            dataType: "json",
                            type: "POST",
                            data: params,
                            success: function (workflowTaskTemplates) {
                                $(taskTemplateDDL).empty();
                                $('<option value="0">--Please select--</option>').appendTo(taskTemplateDDL);
                                $.each(workflowTaskTemplates, function (i, state) {
                                    $('<option value="' + workflowTaskTemplates[i].Text + '">' +
                                        workflowTaskTemplates[i].Text + '</option>').appendTo(taskTemplateDDL);
                                });
                                $(taskTemplateDDL).kendoDropDownList({});
                                if (fromOnGridedit === "NEW" || fromOnGridedit === null) {
                                    $(taskTemplateDDL).data("kendoDropDownList").value("0");
                                } else {
                                    fromOnGridedit = null;
                                }
                            },
                            error: function (result) {
                                $(taskTemplateDDL).empty();
                                $('<option value="0">--Please select--</option>').appendTo(taskTemplateDDL);
                                $(taskTemplateDDL).data("kendoDropDownList").value("0");
                            }
                        });
                    }
                } else {
                    var taskTemplates = WIBillingRatesMasterData.TaskTemplateList;
                    $(taskTemplateDDL).empty();
                    $('<option value="0">--Please select--</option>').appendTo(taskTemplateDDL);
                    $.each(taskTemplates, function (i, state) {
                        $('<option value="' + taskTemplates[i].Text + '">' +
                            taskTemplates[i].Text + '</option>').appendTo(taskTemplateDDL);
                    });
                    $(taskTemplateDDL).kendoDropDownList({});
                    if (fromOnGridedit === "NEW" || fromOnGridedit === null) {
                        $(taskTemplateDDL).data("kendoDropDownList").value("0");
                    } else {
                        fromOnGridedit = null;
                    }
                }
            });
        }

        function TaskTemplateEditor(container, options) {
            var dropdownHtml = $("<select data-role='dropdownlist' name='AssignedTaskTemplateName' id='ddlTaskTemplate" + options.model.id + "' style='width: 100%'/>");
            var ddlTaskTemplate = $(dropdownHtml)
                .appendTo(container)
                .kendoDropDownList({});
            //ddlTaskTemplate.change(function () {
            //    var taskTemplateID = $(this).val();
            //    $("#WForBTaskTemplateID").val(taskTemplateID);
            //});
        }

        function UnitOfMeasureEditor(container, options) {
            var dropdownHtml = $("<select data-role='dropdownlist' name='AssignedUnitOfMeaureName' id='ddlUnitOfMeasure" + options.model.id + "' style='width: 100%'/>");
            $(dropdownHtml)
                .appendTo(container)
                .kendoDropDownList({});
        }

        function CurrencyEditor(container, options) {
            var dropdownHtml = $("<select data-role='dropdownlist' name='AssignedCurrencyName' id='ddlCurrency" + options.model.id + "' style='width: 100%'/>");
            $(dropdownHtml)
                .appendTo(container)
                .kendoDropDownList({});
        }

        function ComplexityEditor(container, options) {
            var dropdownHtml = $("<select data-role='dropdownlist' name='AssignedComplexityName' id='ddlComplexity" + options.model.id + "' style='width: 100%'/>");
            $(dropdownHtml)
                .appendTo(container)
                .kendoDropDownList({});
        }

        function ValidFromEditor(container, options) {
            var startdatecalender = $("");
            startdatecalender = $("<input data-role='datepicker' name='ValidFrom' data-bind='value: ValidFrom'/>");
            $(startdatecalender)
                .appendTo(container).kendoDatePicker({
                    value: new Date(Date.UTC(options.model.ValidFrom)),
                    disableDates: KendoWeekOffDays,  //Pass the off days array
                    format: "{0:dd-MMM-yyyy}",
                    //min: new Date(),
                    month: {
                        empty: '<span class="k-state-disabled">#= data.value #</span>'
                    }
                });
        }

        function ValidToEditor(container, options) {
            var enddatecalender = $("");
            enddatecalender = $("<input data-role='datepicker' name='ValidTo' data-bind='value: ValidTo' />");
            $(enddatecalender)
                .appendTo(container).kendoDatePicker({
                    value: new Date(Date.UTC(options.model.ValidTo)),
                    disableDates: KendoWeekOffDays,  //Pass the off days array
                    format: "{0:dd-MMM-yyyy}",
                    //min: new Date(),
                    month: {
                        empty: '<span class="k-state-disabled">#= data.value #</span>'
                    }
                });
        }

        function onSave(e) {
            $('.WIBillingRatesGridErrorMsg').addClass('hide');
            var workflowTemplateName = e.model.AssignedWorkflowTemplateName;
            var taskTemplateName = e.model.AssignedTaskTemplateName;
            var unitOfMeasure = e.model.AssignedUnitOfMeaureName;
            var currency = e.model.AssignedCurrencyName;
            var complexity = e.model.AssignedComplexityName;
            var rate = e.model.Rate;
            var validFrom; //= e.model.ValidFrom;
            var validTo; //= e.model.ValidTo;
            var id = e.model.id;
            var isNewRow = e.model.isNew();
            var data = this.dataSource.data();
            var uid = e.model.uid;
            var toDayDate = convertDate(new Date());
            var isValidDate = false;
            if (isValidFrom === true) {
                validFrom = null;
            }
            else {
                validFrom = e.model.ValidFrom;
            }
            if (isValidTo === true) {
                validTo = null;
            }
            else {
                validTo = e.model.ValidTo;
            }
            if (data.length > 1) {
                if (isNewRow !== false) {
                    for (var item = 0; item < data.length; item++) {
                        if (data[item].AssignedWorkflowTemplateName === workflowTemplateName && data[item].AssignedTaskTemplateName === taskTemplateName
                            && data[item].AssignedUnitOfMeaureName === unitOfMeasure && data[item].AssignedCurrencyName === currency && data[item].AssignedComplexityName === complexity) {
                            if (data[item].uid !== uid) {
                                if (convertDate(validFrom) < convertDate(data[item].ValidFrom)) {
                                    if (convertDate(validFrom) >= toDayDate && convertDate(validTo) >= convertDate(validFrom)) {
                                        if (convertDate(validFrom) < convertDate(data[item].ValidFrom) && convertDate(validTo) < convertDate(data[item].ValidFrom)) {
                                            isValidDate = true;
                                        }
                                        else {
                                            EnableDisableDuplicateErrorMessage(e);
                                        }
                                    }
                                    else {
                                        EnableDisableDuplicateErrorMessage(e);
                                    }
                                }
                                else if (convertDate(validFrom) <= convertDate(data[item].ValidTo)) {
                                    EnableDisableDuplicateErrorMessage(e);
                                }
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].AssignedWorkflowTemplateName === workflowTemplateName && data[i].AssignedTaskTemplateName === taskTemplateName
                            && data[i].AssignedUnitOfMeaureName === unitOfMeasure && data[i].AssignedCurrencyName === currency && data[i].AssignedComplexityName === complexity) {
                            if (data[i].uid !== uid) {
                                if (convertDate(validFrom) < convertDate(data[i].ValidFrom)) {
                                    if (convertDate(validFrom) >= toDayDate && convertDate(validTo) >= convertDate(validFrom)) {
                                        if (convertDate(validFrom) < convertDate(data[i].ValidFrom) && convertDate(validTo) < convertDate(data[i].ValidFrom)) {
                                            isValidDate = true;
                                        }
                                        else {
                                            EnableDisableDuplicateErrorMessage(e);
                                        }
                                    }
                                    else {
                                        EnableDisableDuplicateErrorMessage(e);
                                    }
                                }
                                else if (convertDate(validFrom) <= convertDate(data[i].ValidTo)) {
                                    EnableDisableDuplicateErrorMessage(e);
                                }
                            }
                        }
                    }
                }
            }
            if (validFrom !== null && validFrom !== "" && validTo !== null && validTo !== "") {
                if (validFrom > validTo) {
                    e.preventDefault();
                    var message = Web_ValidtoGreaterThanValidafrom;
                    $('.WIBillingRatesGridErrorMsg').html('');
                    $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                    $('.WIBillingRatesGridErrorMsg').html(message);
                    window.scrollTo(0, 0);
                    setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
                    CustomValidFrom.parent().addClass('k-invalid');
                    return false;
                }
            }
            if (validTo !== null && validFrom === null || validFrom === "") {
                e.preventDefault();
                CustomValidFrom.parent().addClass('k-invalid');
                return false;
            }

            if (validFrom !== "") {
                if (convertDate(validFrom) < toDayDate) {
                    e.preventDefault();
                    var ValidFromErrMsg = Web_ValidFromDoesNotAcceptPastDates;
                    $('.WIBillingRatesGridErrorMsg').html('');
                    $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                    $('.WIBillingRatesGridErrorMsg').html(ValidFromErrMsg);
                    window.scrollTo(0, 0);
                    setTimeout(function () { $(".BillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
                    CustomValidFrom.parent().addClass('k-invalid');
                    return false;
                }
            }
            if (validTo !== "") {
                if (convertDate(validTo) < toDayDate) {
                    e.preventDefault();
                    var ValidToErrMsg = Web_ValidToDoesNotAcceptPastDates;
                    $('.WIBillingRatesGridErrorMsg').html('');
                    $('.WIBillingRatesGridErrorMsg').removeClass('hide');
                    $('.WIBillingRatesGridErrorMsg').html(ValidToErrMsg);
                    window.scrollTo(0, 0);
                    setTimeout(function () { $(".BillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
                    CustomValidFrom.parent().addClass('k-invalid');
                    return false;
                }
            }
        }
        function convertDate(str) {
            var date = new Date(str),
                month = ("0" + (date.getMonth() + 1)).slice(-2),
                day = ("0" + date.getDate()).slice(-2);
            return [date.getFullYear(), month, day].join("-");
        }

        function EnableDisableDuplicateErrorMessage(e) {
            e.preventDefault();
            var message = Web_RelationshipAlreadyExists;
            $('.WIBillingRatesGridErrorMsg').removeClass('hide');
            $('.WIBillingRatesGridErrorMsg').html(message);
            window.scrollTo(0, 0);
            setTimeout(function () { $(".WIBillingRatesGridErrorMsg").html(''); }, Web_MsgTimeOutValue);
        }

        function onDataBound() {
            //if (!EditBillingRates) {
            //    $(".k-grid-add").prop('disabled', true);
            //    $(".k-grid-edit").prop('disabled', true);            
            //    $(".k-grid-update").prop('disabled', true);
            //    $(".k-grid-cancel").prop('disabled', true);
            //    $(".k-grid-add").attr("title", "insufficient privileges");
            //    $(".k-grid-edit").attr("title", "insufficient privileges");            
            //    $(".k-grid-update").attr("title", "insufficient privileges");
            //    $(".k-grid-cancel").attr("title", "insufficient privileges");
            //    $(".k-grid-add").css('cursor', 'not-allowed');
            //    $(".k-grid-edit").css('cursor', 'not-allowed');            
            //    $(".k-grid-update").css('cursor', 'not-allowed');
            //    $(".k-grid-cancel").css('cursor', 'not-allowed');
            //}
            //else {
            //    $(".k-grid-edit").attr("title", "Edit");            
            //    $(".k-grid-update").attr("title", "Update");
            //    $(".k-grid-cancel").attr("title", "Cancel");
            //}
            $(".k-grid-edit").attr("title", "Edit");
            $(".k-grid-update").attr("title", "Save");
            $(".k-grid-cancel").attr("title", "Cancel");
            $(".k-grid-filter").attr("title", "Search");
            $(".k-grid-edit").prop('disabled', false);
            $(".k-grid-update").prop('disabled', false);
            $(".k-grid-cancel").prop('disabled', false);
            if (this.dataSource.view().length === 0) {
                $('.k-pager-info').hide();
            }
            DisplayNoResponsibilitiesFound($('#WorkItem_BillingRates'));
            $(".k-grid-header th.k-header").css('pointer-events', 'auto');
            $('.k-pager-wrap').css('pointer-events', 'auto');
            //$("#WForBTaskTemplateID").val(null);
            isValidTo = false;
            isValidFrom = false;
        }

        function DisplayNoResponsibilitiesFound(grid) {
            // Get the number of Columns in the grid
            var dataSource = grid.data("kendoGrid").dataSource;
            var colCount = grid.find('.k-grid-header colgroup > col').length;
            // If there are no results place an indicator row
            if (dataSource._view.length === 0) {
                grid.find('.k-grid-content tbody')
                    .append('<tr class="kendo-data-row"><td colspan="' + colCount + '" style="text-align:center">' + Web_NoResponsibilitiesLinked + '</td></tr>');
            }
            // Get visible row count
            var rowCount = grid.find('.k-grid-content tbody tr').length;
            // If the row count is less that the page size add in the number of missing rows
            if (rowCount < dataSource._take) {
                var addRows = dataSource._take - rowCount;
                for (var i = 0; i < addRows; i++) {
                    grid.find('.k-grid-content tbody').append('<tr class="kendo-data-row"><td>&nbsp;</td></tr>');
                }
            }
        }

        $('#btnWIBillingRatesSave').on('click', function () {
            var taskTemplateID = $("#ddlTaskTemplate option:selected").val();
            var params = { taskTemplateID: taskTemplateID };
            $.ajax("/WorkitemEnduser/SaveMasterTaskTemplateList", {
                type: 'POST',  // http method                
                data: params,
                async: false,
                success: function (data) {
                    var taskModal = $('#WIBillingRatesModal');
                    taskModal.modal('hide');
                    $(".divWIbillingrates").html("");
                    $(".divWIbillingrates").html(data);
                }
            });
        });

        $(document).on('change', '#ddlTaskTemplate', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var selectedTaskTemplate = $("#ddlTaskTemplate option:selected").val();
            if (selectedTaskTemplate !== null && selectedTaskTemplate !== "" && selectedTaskTemplate > 0) {
                $('#btnWIBillingRatesSave').prop('disabled', false);
                $('#btnWIBillingRatesSave').css("cursor", 'pointer');
            }
            else if (selectedTaskTemplate === "") {
                $('#btnWIBillingRatesSave').prop('disabled', true);
                $('#btnWIBillingRatesSave').css("cursor", 'not-allowed');
            }
        });
    },

    LoadWeekOffDays: function (WorkDaysList) {
        WeekOffDays = [];
        KendoWeekOffDays = []; //Array tht holds the Week off days 
        if (WorkDaysList !== null) {
            // Checking which is weekday is off and filling the weekoff days array for passing datepicker
            if (!WorkDaysList.Monday) {
                WeekOffDays.push(1);
                KendoWeekOffDays.push("mo");
            }
            if (!WorkDaysList.Tuesday) {
                WeekOffDays.push(2);
                KendoWeekOffDays.push("tu");
            }
            if (!WorkDaysList.Wednesday) {
                WeekOffDays.push(3);
                KendoWeekOffDays.push("we");
            }
            if (!WorkDaysList.Thursday) {
                WeekOffDays.push(4);
                KendoWeekOffDays.push("th");
            }
            if (!WorkDaysList.Friday) {
                WeekOffDays.push(5);
                KendoWeekOffDays.push("fr");
            }
            if (!WorkDaysList.Saturday) {
                WeekOffDays.push(6);
                KendoWeekOffDays.push("sa");
            }
            if (!WorkDaysList.Sunday) {
                WeekOffDays.push(0);
                KendoWeekOffDays.push("su");
            }
        }
    }
};