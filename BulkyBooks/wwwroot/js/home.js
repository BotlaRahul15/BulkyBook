$(document).ready(function () {
    $("#btnSearchProducts").click(function () {
        loadSearchProducts();
    });
    $("#txtItemCount").focusout(function () {
        var selectedCount = parseInt($('#txtItemCount').val(), 10);
        var availableCount = parseInt($('#txtAvailableProductCount').val(), 10);
        if (selectedCount > availableCount) {
            $('#btnAddToCart').attr("disabled", "disabled");
            $('#btnAddToCart').prop('title', 'Please select the count less than available count');
            $('.errorCountMsg').html("Please select the count less than available count");
        }
        else {
            //alert("Ok");
            $('#btnAddToCart').removeAttr("disabled", "disabled");
            $('#btnAddToCart').prop('title', '');
            $('.errorCountMsg').html('');
        }
    });
});

function loadSearchProducts() {
    var url = '/Customer/Home/GetProductsOnFilter';
    $.ajax({
        //type: "POST",
        url: url,
        data: { productName: $('#searchProducts').val().trim() },
        success: function (data) {
            debugger;
            $('#productsListDiv').html('');
            $('#productsListDiv').html(data);
        }
    });

}