module.exports =
{
    "dev": {
        env: 'dev',
        port: process.env.PORT || 8008,
        appName: 'eprocurement',
        secret: 'devontherocks',
        // dbString: 'mongodb://heroku_482vnz04:tk0q583k85fkm9p9pl6g6ntlfk@ds133104.mlab.com:33104/heroku_482vnz04',

        //apiurl: 'http://localhost:8008:'+process.env.PORT,
        dbString: 'mongodb://127.0.0.1:27017/eProcurement_dev',
    },
    "qa": {
        env: 'qa',
        port: 8009,
        appName: 'eprocurement',
        secret: 'devontherocks',
        dbString: 'mongodb://138.197.17.216:31426/eProcurement_qa',
    },
    "prd": {
        env: 'prd',
        port: 80,
        appName: 'eprocurement',
        secret: '0.515036214X',
        dbString: 'mongodb://138.197.17.216:31415/eProcurement',
    }
}
