$(document).ready(function () {

    // var leadfulfillmentapidata = null;
    showLoader(false);
    // getBranchManagersList();
    // getLeadFulfillments();

    $('#iframeHolder').html('');

    // $('#iframeHolder').html('<iframe id="iframe" src="https://kyconboarding.cross-seven.com/main/other" width="700" height="450"></iframe>');

});

function createSession() {

    console.log("Function called ..... ")

    showLoader(true);

    const myHeaders = new Headers();
    myHeaders.append("accept", "*/*");
    myHeaders.append("Content-Type", "Content-Type");
   

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow"
    };

    // fetch("https://10.10.0.40:9005/api/rtc/createsession?pipeLineId=asjcn989wlckmqwkj8%5C8eeklm", requestOptions)
    fetch("https://finezyuat.dvarakgfs.com/api/rtc/createsession?pipeLineId=asjcn989wlckmqwkj8%5C8eeklm", requestOptions)
    .then((response) => {
        if (response.status === 200) {
            return response.json();
        } else {
            // throw new Error(`Error: ${response.status} - ${response.statusText}`);
            $('#error').html(`"<div>Error" +  ${response.status} +" - "+ ${response.statusText} +"!</div>"`).show();
                  
        }
    })
    .then((result) => {
        console.log(result);
        // Now you can access the properties of the JSON object
        $('#success').html( 
        "<li>Admin URL :  " +  result.admin_url + " </li>" +
        "<li>Guest URL :  " +  result.guest_url + " </li>").show();

        // if (!$('#iframe').length) {
             // Clear previous iframe if any
            $('#iframeHolder').html('');

            $('#iframeHolder').html(`<iframe id="iframe" 
            style="width: 100%;height: 120vh; border: none;"
            src="${result.admin_url}"></iframe>`);
        // }
   
    })
    .catch((error) => console.error(error));
   

    
    // $('#iframeHolder').html('<iframe id="iframe" src="https://kyconboarding.cross-seven.com/main/other" width="700" height="450"></iframe>');


    showLoader(false);

    return false;
}