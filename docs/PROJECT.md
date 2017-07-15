# Project Folder Structure

app/  
----- assets/  
---------- img/      // Images and icons for your app    
---------- css/      // All styles and style related files (SCSS or LESS files)    
---------- js/       // JavaScript files written for your app that are not for angular    
---------- libs/     // Bower componets/Third-party libraries such as jQuery, Moment, Underscore, etc.    
----- common/   // acts as reusable components or partials of our site   
---------- app-directives/  // this contains all directives  
---------- app-services/  // this contains reusable services  
---------- app-factories/  // this contains reusable factories  
----- components/   // each component is treated as a mini Angular app   
---------- account/  // logged user accessible content  
---------- static/  // static pages HTMLs  
---------- user/  // user authorization  
----- layout/  // All HTML partials like header/footer   
app.module.js  
app.routes.js  
app.controller.js 
index.html
