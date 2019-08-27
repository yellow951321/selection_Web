# Selection Web
A website which is for management and data marker.

# Index
- <a href='#prerequisite'> Prerequisite </a>
- <a href='#hiOfSelection'> Hierarchy Of Selection Web </a>
- <a href='#auth'> auth </a>
    - <a href='#auth_models'> auth/models </a>
    - <a href='#auth_public'> auth/public </a>
    - <a href='#auth_static'> auth/static </a>
    - <a href='#auth_views'> auth/views </a>
    - <a href='#auth_app'> auth/app.js </a>
- <a href='#mid'> mid-long-term </a>
    - <a href='#mid_models'> mid-long-term/models </a>
    - <a href='#mid_public'> mid-long-term/public </a>
    - <a href='#mid_static'> mid-long-term/static </a>
    - <a href='#mid_routes'> mid-long-term/routes </a>
    - <a href='#mid_views'> mid-long-term/views </a>
    - <a href='#mid_app'> mid-long-term/app.js </a>
- <a href='#short'> short-term </a>
    - <a href='#short_models'> short-term/models </a>
    - <a href='#short_public'> short-term/public </a>
    - <a href='#short_static'> short-term/static </a>
    - <a href='#short_routes'> short-term/routes </a>
    - <a href='#short_views'> short-term/views </a>
    - <a href='#short_app'> short-term/app.js </a>

<a id="prerequisite"></a>

# Prerequisite
- Node js
    - Express
- Sequelize
- HTML/CSS
    - Pug
    - Scss
- Webpack

<a id="hiOfSelection"></a>

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

<a id='auth'></a>

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
        - [`connect.js`](./docs/auth/models/operations/connect.js.md)
        - [`sync-session.js`](./docs/auth/models/operations/Sync-connect.js.md)
        - [`delete-sission.js`](./docs/auth/models/operations/delete-session.js.md)
        - [`get-user-info.js`](./docs/auth/models/operations/get-user-info.js.md)
        - [`login.js`](./docs/auth/models/operations/login.js.md)
    - `models/schemas`, which defines the columns and properties of each column. We have schemas named `session` and `user`.
        - `session.js`
        - `user.js`

<a id="auth_public"></a>

- `auth/public`
    - It is just the bundle of front-end code which is not readable.

<a id="auth_static"></a>

- `auth/static`

    - `auth/static/javascripts`
        - It defines the function of login and signup.
        - `login.js`
        - `signup.js`

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

- [`app.js`](./docs/auth/auth_app.js.md)
    - This is the server, which defines the operation of login and signup.

    - Route
        - `POST /login` - only can be requested from GET `/login` page
        ![POST /login](./flow-chart/auth/post_login.svg)
        - `GET /login` - could be from any page
        ![GET /login](./flow-chart/auth/get_login.svg)
        - `/public` - could be from any page
        ![/public](./flow-chart/auth/public.svg)
        - `GET /channel` - could be from any page
        ![/channel](./flow-chart/auth/channel.svg)
        - `GET /logout` - could be get from `/channel`, `mid-long-term/` and `short-term/`
        ![GET /logout](./flow-chart/auth/logout.svg)

<a id='mid-long-term'></a>

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

- links
    - <a href="#mid_models"> models </a>
    - <a href="#mid_public"> public </a>
    - <a href="#mid_static"> static </a>
    - <a href="#mid_views"> views </a>
    - <a href="#mid_app"> app.js </a>


<a id='mid_models'></a>

- `mid-long-term/models`
    - `/operations`, which defines the connection between the database and server by using `Sequelize` modules and deines the operations to the database.
        - connection
            - [`connect.js`](./docs/mid-long-term/models/operations/connect.js.md)
        - operations
            - [`content-auth.js`](./docs/mid-long-term/models/operations/content-auth.js.md)
            - [`content-change-label.js`](./docs/mid-long-term/models/operations/content-change-label.js.md)
            - [`content-create.js`](./docs/mid-long-term/models/operations/content-create.js.md)
            - [`content-update.js`](./docs/mid-long-term/models/operations/content.update.js.md)
            - [`data-create.js`](./docs/mid-long-term/models/operations/data-create.js.md)
            - [`data-delete.js`](./docs/mid-long-term/models/operations/data-delete.js.md)
            - [`download-csv.js`](./docs/mid-long-term/models/operations/download-csv.js.md)
            - `draw.js` (deprecated)
            - [`get-all-campus.js`](./docs/mid-long-term/models/operations/get-all-campus.js.md)
            - [`get-all-year.js`](./docs/mid-long-term/models/operations/get-all-year.js.md)
            - [`get-all-type.js`](./docs/mid-long-term/models/operations/get-all-type.js.md)
            - [`get-content.js`](./docs/mid-long-term/models/operations/get-content.js.md)
    - `/schemas`
        - which defines the columns and properties of each column. We have schemas named `content` and `data`.
        - `data.js`
            - It represent the campus.
        - `content.js`
            - It represent the content of campus.
<a id='mid_public'></a>

- `mid-long-term/public`
    - It is just the bundle of front-end code which is not readable.
<a id='mid_static'></a>

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
<a id='mid_routes'></a>

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
        ![GET midLongTerm/:typeId](./flow-chart/midLongTerm/campus.svg)
    - `content.js`-`midLongTerm/content`
        - Controll the logic in the edit web page(.scss).
        - `GET /save`
        ![GET /save](./flow-chart/midLongTerm/content/content_save.svg)
        - `GET /delete`
        ![GET /delete](./flow-chart/midLongTerm/content/content-delete.svg)
        - `GET /change`
        ![GET /change](./flow-chart/midLongTerm/content/content-change.svg)
        - `GET /:dataId`
        ![GET /:dataId](./flow-chart/midLongTerm/content/content-dataId.svg)
        - `GET /:dataId/filter`
        ![GET /:dataId/filter](./flow-chart/midLongTerm/content/content-dataId-filter.svg)
        - `GET /:dataId/check`
        ![GET /:dataId/check](./flow-chart/midLongTerm/content/content-get-dataId-check.svg)
        - `POST /:dataId/check`
        ![POST /:dataId/check](./flow-chart/midLongTerm/content/content-post-dataId-check.svg)
        - `GET /:dataId/add`
        ![GET /:dataId/add](./flow-chart/midLongTerm/content/content-dataId-add.svg)
    - `data.js`
        - Controll the logic when the user add a new content or delete a content. And, it also has the function of rendering a edit web page when the users access the edit page.
        - `POST /add`
        ![POST /add](./flow-chart/midLongTerm/data/data-add.svg)
        - `POST /delete`
        ![POST /delete](./flow-chart/midLongTerm/data/data-delete.svg)
        - `/:dataId`
        ![POST /:dataId](./flow-chart/midLongTerm/data/data-dataId.svg)
        - `POST /:dataId/edit`- only could be requested from `year.pug`
        ![POST /:dataId/edit](./flow-chart/midLongTerm/data/data-dataId-edit.svg)
    - `downloadCsv.js`
        - Controll the logic when the user wants to download the current project into a csv file.
        - `downloadCsv/:dataId/index`
        ![GET downloadCsv/:dataId/index](./flow-chart/midLongTerm/download.svg)
    - `graph.js`
        - Controll the logic when the user wants to see the statistic result of the campus.
    - `index.js`
        - Just render the `type.pug` page to the client.
    - `review.js`
        - Controll the logic of reviewer or editor. If the user is the owner, it will redirect to the `data.js`. Otherwise, it will render a `review.pug`
        - GET /check
        ![GET /check](./flow-chart/midLongTerm/review/review-check.svg)
        - GET /conflict
        ![GET /conflict](./flow-chart/midLongTerm/review/review-conflict.svg)
        - GET /:dataId
        ![GET /:dataId](./flow-chart/midLongTerm/review/review-dataId.svg)
        - GET /:dataId/filter
        ![GET /:dataId/filter](./flow-chart/midLongTerm/review/review-dataId-filter.svg)
        - GET /:dataId/index
        ![GET /:dataId/index](./flow-chart/midLongTerm/review/review-dataId-index.svg)
    - `type.js`
        - Sending the web page,`type.pug`, with all types of campuses to the client.
        - GET `/index`
        ![GET /index](./flow-chart/midLongTerm/type.svg)
    - `year.js`
        - Sending the web page, `year.pug`, with all years of campuses to the client.
        - GET `/index`
        ![GET /index](./flow-chart/midLongTerm/year.svg)
<a id='mid_views'></a>

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
<a id='mid_app'></a>

- `app.js`
    - The main hub of all routes. It controll the flow of requesting and error handling.
    - This is the order of the routes
    ![midLongTerm](./flow-chart/midLongTerm/midLongTerm.svg)

<a id='short-term'></a>
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
- links
    - <a href="#short_models"> models </a>
    - <a href="#short_public"> public </a>
    - <a href="#short_static"> static </a>
    - <a href="#short_views"> views </a>
    - <a href="#short_app"> app.js </a>

<a id='short_models'></a>

- `short-term/models`
    - `/operations`, which defines the connection between the database and server by using `Sequelize` modules and deines the operations to the database.
        - connection
            - [`connect.js`](./docs/short-term/models/operations/connect.js.md)
        - operations
            - [`content-auth.js`](./docs/short-term/models/operations/content-auth.js.md)
            - [`content-change-label.js`](./docs/short-term/models/operations/content-change-label.js.md)
            - [`content-create.js`](./docs/short-term/models/operations/content-create.js.md)
            - [`content-update.js`](./docs/short-term/models/operations/content-update.js.md)
            - [`data-create.js`](./docs/short-term/models/operations/data-create.js.md)
            - [`data-delete.js`](./docs/short-term/models/operations/data-delete.js.md)
            - [`download-csv.js`](./docs/short-term/models/operations/download-csv.js.md)
            - `draw.js` (deprecated)
            - [`get-all-campus.js`](./docs/short-term/models/operations/get-all-campus.js.md)
            - [`get-all-year.js`](./docs/short-term/models/operations/get-all-year.js.md)
            - [`get-all-type.js`](./docs/short-term/models/operations/get-all-type.js.md)
            - [`get-content.js`](./docs/short-term/models/operations/get-content.js.md)
    - `/schemas`
        - which defines the columns and properties of each column. We have schemas named `content` and `data`.
        - `data.js`
            - It represent the campus.
        - `content.js`
            - It represent the content of campus.

<a id='short_public'></a>

- `short-term/public`
    - It is just the bundle of front-end code which is not readable.
<a id='short_static'></a>

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
<a id='short_routes'></a>

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
        ![GET /campus](./flow-chart/shortTerm/campus.svg)
    - `content.js`
        - Controll the logic in the edit web page(.scss).
        - `GET /save`
        ![GET /save](./flow-chart/shortTerm/content/content_save.svg)
        - `GET /delete`
        ![GET /delete](./flow-chart/shortTerm/content/content-delete.svg)
        - `GET /change`
        ![GET /change](./flow-chart/shortTerm/content/content-change.svg)
        - `GET /:dataId`
        ![GET /:dataId](./flow-chart/shortTerm/content/content-dataId.svg)
        - `GET /:dataId/filter`
        ![GET /:dataId/filter](./flow-chart/shortTerm/content/content-dataId-filter.svg)
        - `GET /:dataId/check`
        ![GET /:dataId/check](./flow-chart/shortTerm/content/content-get-dataId-check.svg)
        - `POST /:dataId/check`
        ![POST /:dataId/check](./flow-chart/shortTerm/content/content-post-dataId-check.svg)
        - `GET /:dataId/add`
        ![GET /:dataId/add](./flow-chart/shortTerm/content/content-dataId-add.svg)
    - `data.js`
        - Controll the logic when the user add a new content or delete a content. And, it also has the function of rendering a edit web page when the users access the edit page.
        - `POST /add`
        ![POST /add](./flow-chart/shortTerm/data/data-add.svg)
        - `POST /delete`
        ![POST /delete](./flow-chart/shortTerm/data/data-delete.svg)
        - `/:dataId`
        ![POST /:dataId](./flow-chart/shortTerm/data/data-dataId.svg)
        - `POST /:dataId/edit`- only could be requested from `year.pug`
        ![POST /:dataId/edit](./flow-chart/shortTerm/data/data-dataId-edit.svg)
    - `downloadCsv.js`
        - Controll the logic when the user wants to download the current project into a csv file.
        - `downloadCsv/:dataId/index`
        ![GET downloadCsv/:dataId/index](./flow-chart/shortTerm/download.svg)
    - `graph.js`
        - Controll the logic when the user wants to see the statistic result of the campus.
    - `index.js`
        - Just render the `type.pug` page to the client.
    - `review.js`
        - Controll the logic of reviewer or editor. If the user is the owner, it will redirect to the `data.js`. Otherwise, it will render a `review.pug`
        - GET /check
        ![GET /check](./flow-chart/shortTerm/review/review-check.svg)
        - GET /conflict
        ![GET /conflict](./flow-chart/shortTerm/review/review-conflict.svg)
        - GET /:dataId
        ![GET /:dataId](./flow-chart/shortTerm/review/review-dataId.svg)
        - GET /:dataId/filter
        ![GET /:dataId/filter](./flow-chart/shortTerm/review/review-dataId-filter.svg)
        - GET /:dataId/index
        ![GET /:dataId/index](./flow-chart/shortTerm/review/review-dataId-index.svg)
    - `type.js`
        - Sending the web page,`type.pug`, with all types of campuses to the client.
        - GET `/index`
        ![GET /index](./flow-chart/shortTerm/type.svg)
    - `year.js`
        - Sending the web page, `year.pug`, with all years of campuses to the client.
        - GET `/index`
        ![GET /index](./flow-chart/shortTerm/year.svg)
<a id='short_views'></a>

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
<a id='short_app'></a>

- `app.js`
    - The main hub of all routes. It controll the flow of requesting and error handling.
    - This is the order of the routes
    ![midLongTerm](./flow-chart/shortTerm/shortTerm.svg)
