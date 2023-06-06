# imagesnapshot


imagesnapshot ensures the visual consistency of a web application or user interface across different releases and development environments. The tool captures screenshots of specific web pages or components and compares them against previously saved reference images. By analyzing pixel differences between the snapshots and references, the tool detects visual regressions or unintended visual changes that might have been introduced during code changes or deployments. This enables developers to identify and fix visual issues early in the development process, promoting a more stable and visually appealing user experience. The CI visual snapshot tool enhances the overall quality assurance process, providing a visual checkpoint that complements traditional unit and integration tests.


DATABASE


# Installation


## Github

If you do not have a GitHub account sign up for one [here](https://github.com/).

create a new repository using this [guide](https://docs.github.com/en/get-started/quickstart/create-a-repo)

Once you have done this simply add it as a remote

`git remote add <youroriginname> <githuburl>`


## Clone

clone the Payme v2 onto your local machine.

git clone  https://github.com/OrbitLabsDAO/paymev2

then run  the following 2 commands

`npm install --save-dev @11ty/eleventy`

`npm install `

This will set up the Payme v2 locally on your machine.

finally push it to the repo you set up earlier

git push github master


## Cloudflare

If you do not yet have a Cloudflare account please sign up by clicking on this [link](https://dash.cloudflare.com/sign-up?lang=en-US).


Click Pages from the menu on the left. 

![](https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/5c590986-f70c-46d5-7540-46cd284f0d00/public)

Once you are there you can use the following [guide](https://developers.cloudflare.com/pages/get-started/) to connect your git and add the project you just pushed.

Select 11.ty as the framework as shown in the image below

![](https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/77ae9dc2-d46a-4eb6-0480-85be2803b900/public)

then add the ENV vars by going clicking on pages/buildingblocks/settings/environment variables and adding them as shown in the screenshot below

![](https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/ebd4fd7d-6c9b-45ce-e993-63d7ec6c6600/public)



## Wrangler

The next thing you need to do is install Wrangler.  You can find the current documentation for this [here](https://developers.cloudflare.com/workers/wrangler/install-and-update/).

## D1 database
D1 is the Cloudflare database that we are using you can find out more information about it [here](https://developers.cloudflare.com/d1/).


click on workers/d1 and create a new database as shown in the image below

![](https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/4eec15e1-0c5c-4675-5d51-f2b384180c00/public)

then we have to add it to add a D1 database binding called DB and point it to the D1 database you created as shown below 

![](https://imagedelivery.net/9dYZtR12J2uzlEZe4Joa5w/62dc6c22-bddd-402b-8144-53e491a38c00/public)

Now we have to create a wrangler.toml file in the root and add the database name and the id of the database you created in the control panel
note: pages does not use wrangler.toml so I can only assume this is because d1 is in alpha and will be removed soon, regadless the toml file will have the following

[[ d1_databases ]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "databasename"
database_id = "databaseid"

The last thing we have to do is run the SQL file to create the tables

wrangler d1 execute DB --local  --file=./scripts/sql/schema.sql
sudo wrangler d1 execute DB --file=./scripts/sql/schema.sql

create a new migration 

sudo wrangler d1 migrations create DB name

apply the migrations on production 

sudo wrangler d1 migrations apply DB

apply the migrations on locally

sudo wrangler d1 migrations apply DB --local



## Create environment variables 

We have to rename two files at the root of the project. These files contain the following environment variables.


_.env

_.dev.vars

to 

.env

.dev.vars

Both of these files are the same but for some reason, Cloudflare decided not to use the industry standard .env for their functions so we have to replicate it to get it working locally.  In production, we only have one set of environment variables.




run the command

`./build.sh

open a browser and go to the following [URL](http://localhost:8789/) and login in with the following details

`test@orbitlabs.xyz`

`test`

You will see 2 properties, these are test properties so you can see the system running. Feel free to delete these if you want.

## cypress testing

It comes with a full test suite that you can access by running the following command 

`./build.sh cypress`


# Production

Pushing the site to production requires a few more steps the first thing you have to do is push the project to your GitHub account if you make any code changes is easy just push 

git push origin master and it will update it on Cloudflare for you 





