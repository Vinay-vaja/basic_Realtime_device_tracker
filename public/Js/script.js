const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position)=>{
           const { longitude, latitude } = position.coords;

            socket.emit("Send-location",{longitude,latitude})
        },
            (error)=>{
             console.error(error);
        },
        {
            enableHighAccuracy:true,
            maximumAge:0,
            timeout:5000 //here we not use chached data 5000 ma new data automatic location aape
        }
    );
}
const map =L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Powered by me"
}).addTo(map)

const markers={}
socket.on("receive-location",(data)=>{
    const{id,latitude,longitude}=data;
    map.setView([latitude,longitude],16);

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
});

socket.on("user-disconnect",(id)=>{
    map.removeLayer(markers[id])
    delete markers[id];
})