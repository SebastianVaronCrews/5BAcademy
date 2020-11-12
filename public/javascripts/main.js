/*var customerObj = {};
*/

var elements = stripe.elements();
var stripe = Stripe('sk_test_R6n0RPwBEKV4gW2nyOrrAB1q00SMH2Ivnz');

$("tr").on("click", "td", function () {

	$(this).toggleClass("completed");

});
$(document).ready(function () {
    $(".btn").click(function () {
        var val = parseInt($('#group').find('.badge').text());

        // Check for the button clicked 
        if ($(this).hasClass('btn-danger')) {
            $('#group').find('.badge').text(val - 1);
        } else if ($(this).hasClass('btn-success')) {
            $('#group').find('.badge').text(val + 1);
        }
    });
}); 

/*
$("#lesson").click(function () {
    $.getJSON("https://random.cat/meow")
        .done(function (data) {
            $("#catImg").attr("src", data.file);
        })
        .
    .fail(function () {
            alert("request not pawsible");
        })
});*/


/*
$("#register").click(function () {*/
    function createCustomer() {
        let billingEmail = document.querySelector('#email').value;
        return fetch('/create-customer', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: billingEmail
            })
        })
            .then(response => {
                return response.json();
            })
            .then(result => {
                // result.customer.id is used to map back to the customer object
                // result.setupIntent.client_secret is used to create the payment method
                return result;
            });
}

$("#register").click(function () {
createCustomer();

});

*/

/*module.exports = customerObj*/
