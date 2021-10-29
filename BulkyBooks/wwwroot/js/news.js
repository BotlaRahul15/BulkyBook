var dataTable;
var newData;
var table;

$(document).ready(function () {
    $("#searchNews").click(function () {
        debugger;
        $("#waitttAmazingLover").css("display", "block");
        var searchKey = $('#txtSearchNews').val();
        var sourceName = $('#txtSourceName').val();
        //loadDataTable(searchKey);
        //bindDatatable(searchKey); //Server side pagging,searching,sorting
        if (searchKey != null && searchKey != "" && searchKey != "undefined") {
            $.ajax({
                url: '/Admin/New/GetNewsData',
                type: 'GET',
                data: { searchKey: searchKey, sourceName: sourceName },
                dataType: 'json',
                success: function (data, status, xhr) {
                    newData = data;
                    loadDataTable1(newData.data);
                    $("#waitttAmazingLover").css("display", "none");
                },
                error: function () {
                }
            });
        }
        else {
            alert("Please enter search key");
            $("#waitttAmazingLover").css("display", "none");
            return false;
        }
        
    });
    $(document).on('keyup', '#sourceSearchField,#tittleSearchField,#descriptionSearchField', function (e) {
        var sourceVal = $('#sourceSearchField').val();
        var titleVal = $('#tittleSearchField').val();
        var descVal = $('#descriptionSearchField').val();
        table.column(0).search(sourceVal).draw();
        table.column(1).search(titleVal).draw();
        table.column(2).search(descVal).draw();
    });
});


function loadDataTable(searchKey) {
    dataTable = $('#tblNewsData').DataTable({
        "ajax": {
            "url": "/Admin/New/GetNewsData?searchKey=" + searchKey + "",
            "dataSrc": function (data, status, xhr) {
                return data.data;
                
                
            },
        },
        //"data": data.data,
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "columns": [
            { "data": "source.name", "width": "5%" },
            { "data": "title", "width": "10%" },
            { "data": "description", "width": "40%" },
            {
                "data": "url", "orderable": false,
                "render": function (data) {
                    return '<a id="editAnchor" target="_blank" value="' + data +'"  href="'+data+'">'+data+'</a>';
                
                }, "width": "40%"
            },
            {
                "data": "urlToImage", "orderable": false,
                "render": function (data) {
                    return '<img style="width:200px;height:155px" src="' + data + '">';
                }, "width": "40%"
            }
        ]
    });
}

function loadDataTable1(newData) {
    table = $('#tblNewsData').DataTable({
        "stripeClasses": [],
        "destroy": true,
        "processing": false,
        "orderMulti": false,
        "filter": false,
        "searching": false,
        "order": [1, "asc"],
        "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
        "language": {
            "emptyTable": function (newData) {
                return "No records exists"
            }
        },
        "createdRow": function (row, newData, dataIndex) {

        },
        "data": newData,
        "columns": [
            { "data": "source.name", "width": "5%" },
            { "data": "title", "width": "10%" },
            { "data": "description", "width": "40%" },
            {
                "data": "url", "orderable": false,
                "render": function (newData) {
                    return '<a id="editAnchor" target="_blank" href="' + newData + '">' + newData + '</a>';

                }, "width": "40%"
            },
            {
                "data": "urlToImage", "orderable": false,
                "render": function (newData) {
                    return '<img style="width:200px;height:155px" src="' + newData + '">';
                }, "width": "40%"
            }
        ],
        columnDefs: [

        ],
    });
    //if (newData != null) {
    //    $('#tblNewsData tfoot th').each(function () {
    //        var id = $(this).attr('id');
    //        var SearchId = id + 'SearchField';
    //        var InputSearchbox = '<div class="form-group has-feedback"><input type="text"  id="' + SearchId + '" class="form-control"/><i class="fa form-control-feedback"></i></div>';
    //        $(this).html(InputSearchbox);
    //    });
    //} else {
    //    $('#tblNewsData tfoot th').hide();
    //}
}

function bindDatatable(searchKey) {
    datatable = $('#tblNewsData').DataTable({
        "sAjaxSource": "/Admin/New/GetNewsData?searchKey=" + searchKey + "",
        "bServerSide": true,
        "bProcessing": true,
        "bSearchable": true,
        "destroy": true,
        "order": [[1, 'asc']],
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "language": {
            "emptyTable": "No record found.",
            "processing":
                '<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#2a2b2b;"></i><span class="sr-only">Loading...</span> '
        },
        "columns": [
            {
                "data": "source.name",
                "autoWidth": true,
                "searchable": true, "width": "5%"
            },
            {
                "data": "title",
                "autoWidth": true,
                "searchable": true, "width": "10%"
            },
            {
                "data": "description",
                "autoWidth": true,
                "searchable": true, "width": "40%"
            },
            {
                "data": "url", "orderable": false,
                "render": function (newData) {
                    return '<a id="editAnchor" target="_blank" href="' + newData + '">' + newData + '</a>';

                }, "width": "40%"
            },
            {
                "data": "urlToImage", "orderable": false,
                "render": function (newData) {
                    return '<img style="width:200px;height:155px" src="' + newData + '">';
                }, "width": "40%"
            }
        ]
    });
    $("#waitttAmazingLover").css("display", "none");
}
       