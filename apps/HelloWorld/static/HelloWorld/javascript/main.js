var abbr_state = {
    "AL": "alabama",
    "AK": "alaska",
    "AZ": "arizona",
    "AR": "arkansas",
    "CA": "california",
    "CO": "colorado",
    "CT": "connecticut",
    "DE": "delaware",
    "DC": "district-of-columbia",
    "FL": "florida",
    "GA": "georgia",
    "HI": "hawaii",
    "ID": "idaho",
    "IL": "illinois",
    "IN": "indiana",
    "IA": "iowa",
    "KS": "kansas",
    "KY": "kentucky",
    "LA": "louisiana",
    "ME": "maine",
    "MD": "maryland",
    "MA": "massachusetts",
    "MI": "michigan",
    "MN": "minnesota",
    "MS": "mississippi",
    "MO": "missouri",
    "MT": "nontana",
    "NE": "nebraska",
    "NV": "nevada",
    "NH": "new-hampshire",
    "NJ": "new-jersey",
    "NM": "new-mexico",
    "NY": "new-york",
    "NC": "north-carolina",
    "ND": "north-dakota",
    "OH": "ohio",
    "OK": "oklahoma",
    "OR": "oregon",
    "PA": "pennsylvania",
    "PR": "puerto-rico",
    "RI": "rhode-island",
    "SC": "south-carolina",
    "SD": "south-dakota",
    "TN": "tennessee",
    "TX": "texas",
    "UT": "utah",
    "VT": "vermont",
    "VA": "virginia",
    "WA": "washington",
    "WV": "west-virginia",
    "WI": "wisconsin",
    "WY": "wyoming"
};

$(document).on('submit', '.save_form', function(e){
    e.preventDefault();
    $.ajax({
        url:  $(this).attr('action'),
        data: {
            csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
            "url": $("input[name='save_url']").val(),
            "title": $("input[name='save_title']").val(),
            "save_location": $("input[name='save_location']").val(),
            "company": $("input[name='save_company']").val(),
            "date": $("input[name='save_date']").val()
            }, 
        method: 'post',
        success: function(serverResponse){
            //console.log('success', serverResponse)
        }
    })
});

function getJobs(count, x, w, y, z){
    // console.log(x, w, y, z);
    var url = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?page="+count+"&text="+x+"&skill="+w+"&city="+y+","+z;

    $.get(url, function(res) {
        if(res.count < 1){
            $('#sidebar').append("<h3>No available jobs</h3>");
        }
        else{
            for(var i = 0; i < res.resultItemList.length; i++){
                $('#sidebar').append(
                "<a href='" + res.resultItemList[i].detailUrl + 
                "' target='_blank'><h4>" + res.resultItemList[i].jobTitle + "</h4></a>"+
                "<div><h5>" + res.resultItemList[i].company + "</h5>"+
                "<p class = 'job_location'><i>" +"&nbsp"+res.resultItemList[i].location + "</i></p></div>" +
                "<p class = 'job_date'>"  + res.resultItemList[i].date  + "</p>"+ 
                "<form class= 'save_form' action='/save' method='POST'>"+
                    "<input type='hidden' value='"+res.resultItemList[i].detailUrl+"' name='save_url'></input>"+
                    "<input type='hidden' value='"+res.resultItemList[i].jobTitle+"' name='save_title'></input>"+
                    "<input type='hidden' value='"+res.resultItemList[i].company+"' name='save_company'></input>"+
                    "<input type='hidden' value='"+res.resultItemList[i].location+"' name='save_location'></input>"+
                    "<input type='hidden' value='"+res.resultItemList[i].date+"' name='save_date'></input>"+
                "<input type='submit' value='save'></input></form>"
                );
            }
        }   
    }, "json");
}
function getInfo(loc){
    var url ="https://api.datausa.io/attrs/geo/?show=geo&sumlevel=place&where=geo%3A%5E04000US";
    var temp;
    var cities = {};
    $.get(url,function(res){
        temp = res;
    }).done(function(){
        for(var i = 0; i < temp.data.length;i++){
            cities[temp.data[i][1]] = temp.data[i][7];
        }
        if(loc in cities){
            var geo_info;
            $('.info').html("<h3>"+loc+"</h3>");
            url ="https://api.datausa.io/api/?sort=desc&show=geo&required=num_records&sumlevel=all&year=2015&geo=" + cities[loc];
            $.get(url,function(res){
                geo_info = res;
                
            }).done(function(){
                $('.info').append("<p>Number of Records: "+geo_info.data[0][2]+"<p>");
            });
            url ="https://api.datausa.io/api/?sort=desc&force=acs.yg&show=geo&required=pop&sumlevel=all&year=2015&geo=" + cities[loc];
            $.get(url,function(res){
                geo_info = res;
                
            }).done(function(){
                $('.info').append("<p>Population: "+geo_info.data[0][2]+"<p>");
            });
            url ="https://api.datausa.io/api/?sort=desc&show=geo&required=avg_wage&sumlevel=all&year=2015&geo=" + cities[loc];
            $.get(url,function(res){
                geo_info = res;
                
            }).done(function(){
                $('.info').append("<p>Average wage: "+geo_info.data[0][2]+"<p>");
            });
            url ="https://api.datausa.io/api/?sort=desc&force=acs.yg&show=geo&required=median_property_value&sumlevel=all&year=2015&geo=" + cities[loc];
            $.get(url,function(res){
                geo_info = res;
                
            }).done(function(){
                $('.info').append("<p>Median Property Value: "+geo_info.data[0][2]+"<p>");
            });
        }
    });
}
$(document).ready(function(){
    var count = 1;
    var filter = {};
    filter['searches']= $('#search_filter').val();
    filter['skills']= $('#skills_filter').val();
    filter['cities']= $('#city_filter').val();
    filter['states']= $('#state_filter').val();
    getJobs(count, filter.searches, filter.skills, filter.cities, filter.states);
    if(filter['states'] in abbr_state){
        $(".state_container").html("<iframe width='640px' height='480px' src='https://embed.datausa.io/profile/geo/" + abbr_state[filter['states']] + "/economy/income_geo?viz=True' frameborder='0' ></iframe>");
        var temp = filter['cities'] + ', ' + filter['states'];
        getInfo(temp);
    }
    else{
        $(".state_container").html("<iframe width='640px' height='480px' src='https://embed.datausa.io/profile/geo/united-states/economy/income_geo?viz=True' frameborder='0' ></iframe>");
    }
    // console.log(filter);
    $('#sidebar').on('scroll', function() {
        if(Math.round($(this).scrollTop() + $(this).innerHeight(), 10) >= Math.round($(this)[0].scrollHeight, 10)) {
            count++;
            getJobs(count, filter.searches, filter.skills, filter.cities, filter.states);
        }
    });
})