:warning: This project is currently **under development**! however ready to use.

# CJKT Voting Application
A web-based application for voting candidate on CJKT Workshop

## Tools
* [NodeJS](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Bootstrap](https://getbootstrap.com/)

## How to deploy
1. Clone the git repository
    ```bash
    git clone https://github.com/chryspii/cjkt-vote.git
    ```

2. Install all required dependencies
    ```bash
    npm install
    ```

3. Run the application using **Nodemon** 
    ```bash
    nodemon start
    ```

## Documentation
### Directory Structure
```bash
./cjkt-vote/
└── bin/                    # config port and host
│   └── www
└── public/                 # website assets
│   └── css/
│   └── img/
│   └── js/
│   └── scss/
│   └── vendor/
└── routes/                 # controller
│   └── css/
│   └── img/
└── views/                  # front-end 
│   ├── error.pug
│   ├── index.pug
│   └── layout.pug
│   └── login.pug
│   └── presenter.pug
│   └── presenter-result.pug
│   └── questioner.pug
│   └── questioner-result.pug
└── app.js                  # main file
└── package.json            # dependencies
