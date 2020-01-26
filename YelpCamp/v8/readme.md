

RESTful routes (best-practice patterns)

name            url                verb         desc
==========================================================================================
INDEX           /dogs               GET         display a list of all dogs
NEW             /dogs/new           GET         display a form to create a new dog
CREATE          /dogs               POST        add a new dog to the db
SHOW            /dogs/:id           GET         show info about one dog




RESTful routes (this app)

name            url                         verb         desc
==========================================================================================
INDEX           /campgrounds                    GET         display a list of all campgrounds
NEW             /campgrounds/new                GET         display a form to create a new campground
CREATE          /campgrounds                    POST        add a new campground to the db
SHOW            /campgrounds/:id                GET         show info about one campground

NEW             /campgrounds/:id/comments       GET         form to create new comment for one campground
CREATE          /campgrounds/:id/comments/new   POST        add a new comment to one campground