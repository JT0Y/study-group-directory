$('.hidden-code').click(function(e) {
    e.preventDefault();
    $(this).children('.gist').slideToggle();
});

var originalText;
$('.example-grid').children().hover(
    function() {
        originalText = $(this).text();
        $(this).html($(this).width()+'px');
    },
    function() {
        $(this).html(originalText);
    }
);
// find close to coordinates

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(UserLocation);

    } else {
        // loc = "Geolocation is not supported by this browser.";
        NearestCity(38.8951, -77.0367);
    }
}
getLocation();

// Callback function for asynchronous call to HTML5 geolocation
function UserLocation(position) {
  NearestCity(position.coords.latitude, position.coords.longitude);
}


// Convert Degress to Radians
function Deg2Rad(deg) {
  return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = (lat2 - lat1);
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

var cities = [];
var cityNames = [];

$.getJSON('assets/json/campsites2.json').then(function(data) {
    data.forEach(function(loc) {
      const coordString = loc.coordinates;
      let values = coordString.split(" ");

      var lat = ConvertDMSToDD(parseFloat(values[0]));
      var lng = ConvertDMSToDD(parseFloat(values[1]));
      let coords = [loc.city, loc.state, loc.country, lat, lng];

      cities.push(coords);

      if(loc.state.length==0){
        cityNames.push(loc.city+", "+loc.country);
      } else {
        cityNames.push(loc.city+", "+loc.state+", "+loc.country);
      }


  });
});

function ConvertDMSToDD(degrees) {
    var dd = degrees;

    // if (direction == "S" || direction == "W") {
    //     dd = dd * -1;
    // } // Don't do anything for N or E
    return dd;
}

function NearestCity(latitude, longitude) {
  var mindif = 99999;
  var closest;

  for (index = 0; index < cities.length; ++index) {
    var dif = PythagorasEquirectangular(latitude, longitude, cities[index][3], cities[index][4]);
    if (dif < mindif) {
      closest = index;
      mindif = dif;
    }
  }



  $.getJSON('assets/json/campsites2.json').then(function(data) {
      data.forEach(function(loc) {
        const img = loc.photoUrl || "/assets/img/bannercropped.png",
          city = loc.city,
          state = loc.state,
          country = loc.country,
          url = loc.url,
          coords = loc.coordinates;
          let location = '';
          if(state.length==0){
            location = city + ", " + country;
          } else {
            location = city + ", " + state + ", " + country;
          }
          if (city == cities[closest][0]){
          $("#closeCamps").append(
              `
                <li>
                  <div class="four columns alpha">
                      <img class="profile-image" src="${img}" alt="No Image">
                      <div class="palette-pad">
                          <h4>${location}</h4>
                          <a href="${url}" target="_blank">
                              <h5>Facebook Page</h5>
                          </a>
                      </div>
                  </div>
                </li>
              `
          );
        }
      });
    });
}

//full list of locations
$.getJSON('assets/json/campsites2.json').then(function(data) {

    data.forEach(function(loc) {
      const img = loc.photoUrl || "/assets/img/bannercropped.png",
        city = loc.city,
        state = loc.state,
        country = loc.country,
        url = loc.url;
        let location = '';

        if(state.length==0){
          location = city + ", " + country;
        } else {
          location = city + ", " + state + ", " + country;
        }


        $("#camps").append(
            `
              <li class="working">
                <div class="four columns alpha">
                    <img class="lazy profile-image" src="${img}" alt="No Image">
                    <div class="palette-pad">
                        <h4 class='city'>${location}</h4>
                        <a href="${url}" target="_blank">
                            <h5>Facebook Page</h5>
                        </a>
                    </div>
                    <hr/>
                </div>

              </li>
            `
        );

    });
});

//search
$('#search').keyup(function () {
    var li = [];
    var valThis = this.value.toLowerCase();
    valThis = valThis.toLowerCase();
    //     // length  = this.value.length;
    valThis = valThis.replace(/\s+/g, '');

    var length = parseInt(size);


    $('.city').each(function() {
      var currentLiText = $(this).text(),
          showCurrentLi = ((currentLiText.toLowerCase()).replace(/\s+/g, '')).indexOf(valThis) !== -1;
        $(this).parent().parent().toggle(showCurrentLi);
        if(showCurrentLi==true){
          li.push(showCurrentLi);
          if(li.length < 7){
            $('#camps > li > div > img').css('display', 'block')
          } else {
            $('#camps > li > div > img').css('display', 'none')
          }
        }
    });

    var size = $('#camps').find('li').length;
    $("#res").html(li.length);

});

// $('#search').autocomplete({
//
//   source: cityNames
//
//   });

function showPosition(position) {
    loc = "Latitude: " + position.coords.latitude +
    " Longitude: " + position.coords.longitude;
      console.log(loc);
}

// responsive 16x9 iframe - restricted by parent's width
var resizeIframe = function() {
    $('.responsive-iframe iframe').each(function(index, iframe) {
        var parentWidth = $(iframe).parent().width();
        $(iframe).width(parentWidth);
        $(iframe).height(parentWidth / 16 * 9);
    });
};
$(window).on('resize', resizeIframe);
resizeIframe();