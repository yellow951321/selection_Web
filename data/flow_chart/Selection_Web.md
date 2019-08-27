# Selection Web
A website which is for management and data marker.

# Prerequisite
- Node js
    - Express
- Sequelize
- HTML/CSS
    - Pug
    - Scss
- Webpack

<a href='#auth_models'>auth/models</a>

# Hierarachy of Selection web
```bash
selection_Web/
├── data
├── auth
├── mid-long-term
├── short-term
├── doc
└── lib
```
This project has three apps, named `auth`, `mid-long-term`, `short-term`, respectively.

# `auth`
The `auth` app handles the operation of login.

```bash
auth
├── models
│   ├── operations
│   └── schemas
├── public
│   ├── javascripts
│   └── stylesheets
├── static
│   ├── javascripts
│   └── stylesheets
│       └── component
├── views
│   └── mixins
└── app.js
```
- links
    - <a href="#auth_models"> models </a>
    - <a href="#auth_public"> public </a>
    - <a href="#auth_static"> static </a>
    - <a href="#auth_views"> views </a>
    - <a href="#auth_app"> app.js </a>

<a id='auth_models'></a>
- `auth/models`

    - `models/operations`, which defines the connection between the database and server by using `Sequelize` modules.
        - [`connect.js`](https://hackmd.io/SHKrnas3SHOuMzQ6nbZK1w?both)
        - [`sync-session.js`](https://hackmd.io/Ok-YiwE4SLeCf5f9ltTE5w)
        - [`delete-sission.js`](https://hackmd.io/Y03A1JwzReijkrYLZCfzcQ)
        - [`get-user-info.js`](https://hackmd.io/byoZCcCqSnCdF3GTKF_e5g?both)
        - [`login.js`](https://hackmd.io/sx3VxGASSaibHE4KvfvICg)
    - `models/schemas`, which defines the columns and properties of each column. We have schemas named `session` and `user`.
        - [`session.js`](https://hackmd.io/DQccnW8GSU6i6-XpGE9JIQ)
        - [`user.js`](https://hackmd.io/_7pcP-nHT3G8dl8ZSKUJgw)

<a id="auth_public"></a>
- `auth/public`
    - It is just the bundle of front-end code which is not readable.

<a id="auth_static"></a>
- `auth/static`

    - `auth/static/javascripts`
        - It defines the function of login and signup.
        - [`login.js`](https://hackmd.io/kw0LaJzeRjyIZy0-j0IXAQ)
        - [`signup.js`](https://hackmd.io/bEv5a2MCTi2XsW0CHvEkyA)

    - `auth/static/stylesheets`
        - It defines the exterior of the web page
        - `component/`
            - `_manage.scss`
            - `_style.scss`
        - `signup.css`
        - `login.css`
        - `signup.css`

<a id="auth_views"></a>
- `auth/views`
    - This defines the html of login web page and signup web page.

<a id="auth_app"></a>
- [`app.js`](https://hackmd.io/iBpjWIvnRqK8eAmIUpLDXQ#module_userApp..login)
    - This is the server, which defines the operation of login and signup.

    - Route
        - `POST /login` - only can be requested from GET `/login` page
        ![POST /login](./auth/post_login.svg)
        - `GET /login` - could be from any page
        ![GET /login](./auth/get_login.svg)
        - `/public` - could be from any page
        ![/public](./auth/public.svg)
        - `GET /channel` - could be from any page
        ![/channel](./auth/channel.svg)
        - `GET /logout` - could be get from `/channel`, `mid-long-term/` and `short-term/`
        ![GET /logout](./auth/logout.svg)

# `mid-long-term`
```bash
mid-long-term/
├── models
│   ├── operations
│   └── schemas
├── public
│   ├── javascripts
│   └── stylesheets
├── routes
├── static
│   ├── javascripts
│   │   ├── module
│   │   └── src
│   └── stylesheets
│       └── component
├── views
│    └── mixins
│        └── editnodes
└── app.js


```

- `mid-long-term/models`
    - `/operations`, which defines the connection between the database and server by using `Sequelize` modules and deines the operations to the database.
        - connection
            - [`connect.js`](https://hackmd.io/9ERaXWGLRCuxHzBtrFiGiA)
        - operations
            - [`content-auth.js`](https://hackmd.io/iiao7-TCTKqyx_VPizSxgw)
            - [`content-change-label.js`](https://hackmd.io/n_0lDpKORDKV_0BQGeFW0A)
            - [`content-create.js`](https://hackmd.io/Yjuql7JmTeOBSv6kswfObQ)
            - [`content-update.js`](https://hackmd.io/wJrvIgXzQH-psws782e3oA)
            - `content-filter.js`
            - [`data-create.js`](https://hackmd.io/5vrrDLjKS16q8Rxwht_8cg)
            - [`data-delete.js`](https://hackmd.io/CdTK5J6CSFiTkCf30wiNqQ)
            - [`download-csv.js`](https://hackmd.io/dHAEUp3KT9WU4eQ5YdpnuA)
            - `draw.js` (deprecated)
            - [`get-all-campus.js`](https://hackmd.io/nbl4ko22QYO1jV2NCBqstg)
            - `get-all-year.js`
            - `get-all-type.js`
            - `get-content.js`
    - `/schemas`
        - which defines the columns and properties of each column. We have schemas named `content` and `data`.
        - `data.js`
            - It represent the campus.
        - `content.js`
            - It represent the content of campus.

- `mid-long-term/public`
    - It is just the bundle of front-end code which is not readable.

- `mid-long-term/static`

    - `/javascripts`
        - It defines the function of creating new campus and buttons on the web page.

        - ```bash
            javascripts/
            ├── campus.js
            ├── draw.js
            ├── edit.js
            ├── module
            │   ├── projectCreation.js
            │   └── projectDelete.backup.js
            ├── review.js
            ├── src
            │   └── schema.js
            ├── type.js
            └── year.js
            ```

        - `campus.js`
            - Just import the `projectCreation.js`.

        - `draw.js` (deprecated)
            - Define the figure drew on the web page.
        - `edit.js`
            - Define the function of the  filter and dropdown button in the edit mode when the user owns the edit permission. Otherwise, the user only has the permission to read.
        - `module/`
            - `projectCreation.js`
                - It will be called when the users add a new campus to the database.
            - `projectDelete.backup.js`
                - It will be called when the users want to delete a campus(project)

        - `review.js`
            - Define the function of the filter and dropdown button in the read-only mode when the user doesn't own the edit permission.
        - `src/schema.js`
            - Containing a object with the label information.(It is used to control the dropdown button)
        - type.js
            - Import `projectCreation.js`.
        - year.js
            - Import `projectCreation.js` and the function of progress bar.

    - `/stylesheets`
        - It defines the exterior of the web page
        - `signup.css`
        - `login.css`
        - `signup.css`

    - `mid-long-term/routes`
        - All routes of controlling the logic of responding and requesting
        - Hierarachy
            - ```bash
                routes/
                ├── campus.js
                ├── content.js
                ├── data.js
                ├── downloadCsv.js
                ├── graph.js
                ├── index.js
                ├── review.js
                ├── type.js
                └── year.js
                ```
        - `campus.js` - `GET midLongTerm/:typeId`
            - Controll the logic in the campus web page(.scss).
            ![GET midLongTerm/:typeId](./mid-long-term/campus.svg)
        - `content.js`-`midLongTerm/content`
            - Controll the logic in the edit web page(.scss).
            - `GET /save`
            ![GET /save](./mid-long-term/content/content-save.svg)
            - `GET /delete`
            ![GET /delete](./mid-long-term/content/content-delete.svg)
            - `GET /change`
            ![GET /change](./mid-long-term/content/content-change.svg)
            - `GET /:dataId`
            ![GET /:dataId](./mid-long-term/content/content-dataId.svg)
            - `GET /:dataId/filter`
            ![GET /:dataId/filter](./mid-long-term/content/content-dataId-filter.svg)
            - `GET /:dataId/check`
            ![GET /:dataId/check](./mid-long-term/content/content-get-dataId-check.svg)
            - `POST /:dataId/check`
            ![POST /:dataId/check](./mid-long-term/content/content-post-dataId-check.svg)
            - `GET /:dataId/add`
            1[GET /:dataId/add](./mid-long-term/content/content-dataId-add.svg)
        - `data.js`
            - Controll the logic when the user add a new content or delete a content. And, it also has the function of rendering a edit web page when the users access the edit page.
            - `POST /add`
            ![POST /add](./mid-long-term/data/data-add.svg)
            - `POST /delete`
            ![POST /delete](./mid-long-term/data/data-delete.svg)
            - `/:dataId`
            ![POST /:dataId](./mid-long-term/data/data-dataId.svg)
            - `POST /:dataId/edit`- only could be requested from `year.pug`
            ![POST /:dataId/edit](./mid-long-term/data/data-dataId-edit.svg)
        - `downloadCsv.js`
            - Controll the logic when the user wants to download the current project into a csv file.
            - `downloadCsv/:dataId/index`
            ![GET downloadCsv/:dataId/index](./mid-long-term/download.svg)
        - `graph.js`
            - Controll the logic when the user wants to see the statistic result of the campus.
        - `index.js`
            - Just render the `type.pug` page to the client.
        - `review.js`
            - Controll the logic of reviewer or editor. If the user is the owner, it will redirect to the `data.js`. Otherwise, it will render a `review.pug`
            - GET /check
            ![GET /check](./mid-long-term/review/review-check.svg)
            - GET /conflict
            ![GET /conflict](./mid-long-term/review/review-conflict.svg)
            - GET /:dataId
            ![GET /:dataId](./mid-long-term/review/review-dataId.svg)
            - GET /:dataId/filter
            ![GET /:dataId/filter](./mid-long-term/review/review-dataId-filter.svg)
            - GET /:dataId/index
            ![GET /:dataId/index](./mid-long-term/review/review-dataId-index.svg)
        - `type.js`
            - Sending the web page,`type.pug`, with all types of campuses to the client.
            - GET `/index`
            ![GET /index](./mid-long-term/type.svg)
        - `year.js`
            - Sending the web page, `year.pug`, with all years of campuses to the client.
            - GET `/index`
            ![GET /index](./mid-long-term/year.svg)
    - `/views`
        - All web pages of mid-long-term are here.
        - Hierarachy
            - ```bash
                views
                ├── campus.pug
                ├── edit.pug
                ├── editwithfilter.pug
                ├── error.pug
                ├── graph.pug
                ├── mixins
                │   ├── _addbutton.pug
                │   ├── _breadcrumb.pug
                │   ├── editnodes
                │   │   ├── check.pug
                │   │   ├── newedit.pug
                │   │   ├── own.pug
                │   │   ├── packup
                │   │   └── review.pug
                │   ├── filter.pug
                │   ├── _filterthreefield.pug
                │   ├── layout.pug
                │   ├── _midlongcss.pug
                │   ├── _midlongjavascript.pug
                │   ├── _projectcreation.pug
                │   ├── _rendercampus.pug
                │   ├── _renderyear.pug
                │   └── _suredelete.pug
                ├── review.pug
                ├── type.pug
                └── year.pug
                ```
        - `campus.pus`
        - `edit.pus`
        - `editwithfilter.pug`
        - `error.pug`
        - `graph.pug`
        - `mixins/`
            - `_addbutton.pug`
            - `_breadcrumb.pug`
            - `editnodes/`
                - `check.pug`
                - `newedit.pug`
                - `own.pug`
                - `review.pug`
            - `filter.pug`
            - `_filterthreefield.pug`
            - `layout.pug`
            - `_midlongcss.pug`
            - `_midlongjavascript.pug`
            - `_projectcreation.pug`
            - `_rendercampus.pug`
            - `_renderyear.pug`
            - `_suredelete.pug`
            - `review.pug`
            - `type.pug`
            - `year.pug`
    - `app.js`
        - The main hub of all routes. It controll the flow of requesting and error handling.
        - This is the order of the routes
```graphviz
digraph finite_state_machine {
    rankdir=TB;
    size="8,5"
    node [shape=rectangle]
    
    authUser -> typeRouter[label = " /"]
    typeRouter -> campusRouter[label = "  /:typeId"]
    campusRouter -> yearRouter[label = "  /:typeId/:campusId"]
    app -> authUser[label = " /*"]
    authUser -> dataRouter[label = " /data"]
    authUser -> contentRouter[label = " /content"]
    authUser -> reviewRouter[label = " /review"]
    authUser -> downloadRouter[label = " /download"]
}
```
# short-term

```bash=
short-term
├── models
│   ├── operations
│   └── schemas
├── public
│   ├── javascripts
│   └── stylesheets
├── routes
├── static
│   ├── javascripts
│   │   ├── module
│   │   └── src
│   └── stylesheets
│       └── component
└── views
    └── mixins
        └── editnodes

```
- `short-term/models`
    - `/operations`, which defines the connection between the database and server by using `Sequelize` modules and deines the operations to the database.
        - connection
            - [`connect.js`](https://hackmd.io/9ERaXWGLRCuxHzBtrFiGiA)
        - operations
            - [`content-auth.js`](https://hackmd.io/iiao7-TCTKqyx_VPizSxgw)
            - [`content-change-label.js`](https://hackmd.io/n_0lDpKORDKV_0BQGeFW0A)
            - [`content-create.js`](https://hackmd.io/Yjuql7JmTeOBSv6kswfObQ)
            - [`content-update.js`](https://hackmd.io/wJrvIgXzQH-psws782e3oA)
            - [`data-create.js`](https://hackmd.io/5vrrDLjKS16q8Rxwht_8cg)
            - [`data-delete.js`](https://hackmd.io/CdTK5J6CSFiTkCf30wiNqQ)
            - [`download-csv.js`](https://hackmd.io/dHAEUp3KT9WU4eQ5YdpnuA)
            - `draw.js` (deprecated)
            - [`get-all-campus.js`](https://hackmd.io/nbl4ko22QYO1jV2NCBqstg)
            - [`get-all-year.js`](https://hackmd.io/EWG0hIs-SHug3h89SkVEzA)
            - [`get-all-type.js`](https://hackmd.io/R52LF6fJRBywRe12cAjalA)
            - [`get-content.js`](https://hackmd.io/4lyea_eIS-Osus-iYBKhZA)
    - `/schemas`
        - which defines the columns and properties of each column. We have schemas named `content` and `data`.
        - `data.js`
            - It represent the campus.
        - `content.js`
            - It represent the content of campus.

- `short-term/public`
    - It is just the bundle of front-end code which is not readable.

- `short-term/static`

    - `/javascripts` 
        - It defines the function of creating new campus and buttons on the web page.

        - ```bash
            javascripts/
            ├── campus.js
            ├── draw.js
            ├── edit.js
            ├── module
            │   ├── projectCreation.js
            │   └── projectDelete.backup.js
            ├── review.js
            ├── src
            │   └── schema.js
            ├── type.js
            └── year.js
            ```

        - `campus.js`
            - Just import the `projectCreation.js`.

        - `draw.js` (deprecated)
            - Define the figure drew on the web page.
        - `edit.js`
            - Define the function of the  filter and dropdown button in the edit mode when the user owns the edit permission. Otherwise, the user only has the permission to read.
        - `module/`
            - `projectCreation.js`
                - It will be called when the users add a new campus to the database. 
            - `projectDelete.backup.js`
                - It will be called when the users want to delete a campus(project)

        - `review.js`
            - Define the function of the filter and dropdown button in the read-only mode when the user doesn't own the edit permission.
        - `src/schema.js`
            - Containing a object with the label information.(It is used to control the dropdown button)
        - type.js
            - Import `projectCreation.js`.
        - year.js
            - Import `projectCreation.js` and the function of progress bar.
        
    - `/stylesheets`
        - It defines the exterior of the web page
        - `signup.css`
        - `login.css`
        - `signup.css`

    - `short-term/routes`
        - All routes of controlling the logic of responding and requesting
        - Hierarachy
            - ```bash 
                routes/
                ├── campus.js
                ├── content.js
                ├── data.js
                ├── downloadCsv.js
                ├── graph.js
                ├── index.js
                ├── review.js
                ├── type.js
                └── year.js
                ```
        - `campus.js`
            - Controll the logic in the campus web page(.scss).
        - `content.js`
            - Controll the logic in the edit web page(.scss).
        - `data.js`
            - Controll the logic when the user add a new content or delete a content. And, it also has the function of rendering a edit web page when the users access the edit page.
        - `downloadCsv.js`
            - Controll the logic when the user wants to download the current project into a csv file.
        - `graph.js`
            - Controll the logic when the user wants to see the statistic result of the campus.
        - `index.js`
            - Just render the `type.pug` page to the client. 
        - `review.js`
            - Controll the logic of reviewer or editor. If the user is the owner, it will redirect to the `data.js`. Otherwise, it will render a `review.pug`
        - `type.js`
            - Sending the web page,`type.pug`, with all types of campuses to the client.
        - `year.js`
            - Sending the web page, `year.pug`, with all years of campuses to the client.
    - `/views`
        - All web pages of mid-long-term are here.
        - Hierarachy
            - ```bash
                views
                ├── campus.pug
                ├── edit.pug
                ├── editwithfilter.pug
                ├── error.pug
                ├── graph.pug
                ├── mixins
                │   ├── _addbutton.pug
                │   ├── _breadcrumb.pug
                │   ├── editnodes
                │   │   ├── check.pug
                │   │   ├── newedit.pug
                │   │   ├── own.pug
                │   │   ├── packup
                │   │   └── review.pug
                │   ├── filter.pug
                │   ├── _filterthreefield.pug
                │   ├── layout.pug
                │   ├── _midlongcss.pug
                │   ├── _midlongjavascript.pug
                │   ├── _projectcreation.pug
                │   ├── _rendercampus.pug
                │   ├── _renderyear.pug
                │   └── _suredelete.pug
                ├── review.pug
                ├── type.pug
                └── year.pug
                ```
        - `campus.pus`
        - `edit.pus`
        - `editwithfilter.pug`
        - `error.pug`
        - `graph.pug`
        - `mixins/`
            - `_addbutton.pug`
            - `_breadcrumb.pug`
            - `editnodes/`
                - `check.pug`
                - `newedit.pug`
                - `own.pug`
                - `review.pug`
            - `filter.pug`
            - `_filterthreefield.pug`
            - `layout.pug`
            - `_midlongcss.pug`
            - `_midlongjavascript.pug`
            - `_projectcreation.pug`
            - `_rendercampus.pug`
            - `_renderyear.pug`
            - `_suredelete.pug`
            - `review.pug`
            - `type.pug`
            - `year.pug`
    - `app.js`
        - The main hub of all routes. It controll the flow of requesting and error handling.
        - This is the order of the routes
```graphviz
digraph finite_state_machine {
    rankdir=TB;
    size="8,5"
    node [shape=rectangle]
    
    authUser -> typeRouter
    typeRouter -> campusRouter
    campusRouter -> yearRouter
    app -> authUser
    authUser -> dataRouter
    authUser -> contentRouter
    authUser -> reviewRouter
    authUser -> downloadRouter
}
```
