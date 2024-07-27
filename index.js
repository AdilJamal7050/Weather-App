const usertab=document.querySelector("[data-userWeather]");
const searchtab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccesscontainer=document.querySelector(".grant-location-container")
const searchForm=document.querySelector("[data-searchForm]");
const loadingscreen=document.querySelector(".loading-container");
const userInfocontainer=document.querySelector(".user-info-container");


//initially variables needed
let currenttab=usertab;
currenttab.classList.add("current-tab");
function switchTab(clickedTab){
    if(clickedTab!=currenttab){
        currenttab.classList.remove("current-tab");
        currenttab=clickedTab;
        currenttab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            //kya search form wala container is invisible if yes then make it visible
            userInfocontainer.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //main pahle search wale tab pe tha ab your weather wale tab pe jaana hai
            searchForm.classList.remove("active");
            userInfocontainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
}
usertab.addEventListener('click',function(){
    switchTab(usertab);
});
searchtab.addEventListener('click',function(){
    switchTab(searchtab);
});
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates na mile to
        grantAccesscontainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //make grant access location inactive
     grantAccesscontainer.classList.remove("active");
       //make loading active
       loadingscreen.classList.add("active");
       try{
          const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=aa8f5cfe9645abc5404b65c184eb26c8`);
          const data=await response.json();
          loadingscreen.classList.remove("active");
          userInfocontainer.classList.add("active");
          renderWeatherinfo(data);
          
       }
       catch(err){
            loadingscreen.classList.remove("active");
       }
}
function renderWeatherinfo(weatherInfo){
    //firstly we have to fetch the element
    const cityname=document.querySelector("[data-cityName]");
    const countryicon=document.querySelector("[data-countryicon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    cityname.innerText=weatherInfo?.name;
    countryicon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=` https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°K`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
    }


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{

    }
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

function showposition(position){
    const usercoordinates={
        lat:position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}
const searchinput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchinput.value;
    if(cityName==""){
        return;
    }
    else
    fetchSearchWeatherInfo(cityName);

});
async function fetchSearchWeatherInfo(city){
    loadingscreen.classList.add("active");
    userInfocontainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active");
    try{
      const response=  await  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=aa8f5cfe9645abc5404b65c184eb26c8`);
      const data=await response.json();
      loadingscreen.classList.remove("active");
      userInfocontainer.classList.add("active");
      renderWeatherinfo(data);
    }
   catch(error){
         errordisplay();
   }
}
function errordisplay(){
    const cityname=document.querySelector("[data-cityName]");
    const countryicon=document.querySelector("[data-countryicon]");

    countryicon.src=`https://www.google.com/url?sa=i&url=https%3A%2F%2Ficonduck.com%2Fillustrations%2F106158%2F404-page-not-found&psig=AOvVaw25CaKIJ7kZR8EmhrjKSNdW&ust=1712043257000000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCMDut6PAoIUDFQAAAAAdAAAAABAE`;
    cityname.innerText=citynotfound;


}

