 import RNSimpleCompass from 'react-native-simple-compass';
 console.log(RNSimpleCompass);

 const direction = (location1, location2) => {
   // compass angle is the from you to the person B
 const difflong = location2.longitude - location1.longitude;
   const difflat = location2.latitude - location1.latitude;
   let compass_angle = 1;

  if (difflong >= 0 && difflat >= 0) {
     compass_angle = Math.cos(difflat / difflong);
   } else if (difflong < 0 && difflat >= 0) {     compass_angle = 180 - Math.cos(difflat / difflong);
   } else if (difflong >= 0 && difflat < 0) {
     compass_angle = 360 - Math.cos(difflat / difflong);
  } else if (difflong < 0 && difflat < 0) {
     compass_angle = 180 + Math.cos(difflat / difflong);
   }

   // Calculates the degree phone is facing in
   const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
   const degree = RNSimpleCompass.start(degree_update_rate, degree => {
     RNSimpleCompass.stop();
     return degree;
   });

   let final_degree;

   if (degree > compass_angle) {
     final_degree = 360 - degree + compass_angle;
   } else if (degree < compass_angle) {
     final_degree = compass_angle - degree;
   } else {
     final_degree = 0;
   }

   return final_degree;
 };

 export default direction;

