# node.js

2024 belajar lagi

npm install nodemon --save-dev

using debugger is important to see logical error in our code

npm install --save express

delete routes.js

learn about express js, middleware, parsing incoming request

npm install --save body-parser

body parser do thing in the middleware

app.use, app.post, app.put ext

form is important to send data

make routes folder, separate admin and shop, import Router is from express

create export from that admin and shop routes then call it in app.js using require

add status 404 for can not get/ sadsdww

filtering path like '/admin'

creating views folder, and add some html

need require path to make sure root folder, and to send view

make folder for helper named util, to make path for root folder clean code

make some nice add product and shop menu

make public folder, with static file system

make products empty array to make product data in routes and send to shop, that require admin

using EJS templating engine, npm install ejs, initiate them

copy some css code from the course,

add data to res.render in shop and admin js

using ejs , showing data with ejs and do looping

layout with partial in ejs

<% prods.forEach((prod) => { %>

<%= prod.title %>

<% }) %>

MVC (Model, View, Controller), create controller file and then link/eksports , to be use in routes, why 404 is failed?

create models for product, using class, require them on controller products, call it in get and post router
using product make blurprint using new Product(...) so the view can comunicate with controller

save data to a file, in product model using callback

make (refactoring) a helper in product model

refactoring to admin and shop folder in views

adding more views mean more feature, add more code into navigation

registering new route, add new exports.get.. in controller, make empty ejs for now

editing products model, to make product form, in view we extract data by name in the form

display product data (view)

editing and deleting product

adding another item, Orders

section 9, dynamic routes & advanced models

refactoring file structures

adding product id, in the model also in view

//dynamic route is order after static routes ???

add dynamic params in routes, so we can get that detail id

loading detail product after get the specific id (using find(p => ....))

editing detail product to show data in view and controller

make cart logic in controller, routes, and view . passing hidden data, id

Cannot read properties of undefined (reading 'title') because pageTitle in shop controller is undefine, but product it's define, so using this code bellow, to solve the problem, for now, so the red error is gone
if (product != undefined) {
cb(product);
}
