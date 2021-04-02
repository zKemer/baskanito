const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
//////DİSCORD GİRİSİ



const express = require('express')
const app = express();
require('./util/eventLoader.js')(client);
const passport = require("passport");
const { Strategy } = require('passport-discord');
const session = require('express-session')
passport.serializeUser(( user, done) => {
done(null, user);
})

passport.deserializeUser((obj, done) => {
done(null, obj);
})


let strategy = new Strategy({
clientID: "780799480484069376",
clientSecret: "mES3dxKM-5_ngTNLvXgAUjfckb4KR6Cl",
callbackURL: "https://yorum.yorumbey.repl.co/callback",
scope: ['guilds', 'identify']
}, (accessToken, refreshToken, profile, done) => {
process.nextTick(() => done(null, profile));
});

passport.use(strategy);

app.use(session({

  secret: "secret",
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());


app.use(passport.session());


app.get("/giris", passport.authenticate("discord", {
 
    scope: ["guilds", "identify"]
  })
 
);

app.get(
  "/callback",
  passport.authenticate("discord", {
    
    failureRedirect: "/error"
  }),
  (req, res) => {
    res.redirect("/");
    client.channels.cache.get("824895010859778049").send(`> ${req.user.username} siteye giriş yaptı.`)
  }
);




app.get("/", function(req,res) {
   
	res.render('./index.ejs', {
		title: req.user,

	});
});


app.get('/panel', function (req, res) {
      let guild = client.guilds.cache.get("741055407119794267");
      let member = req.user ? guild.members.cache.get(req.user.id) : null;
     if(!req.user) {
     res.render("./index.ejs", {
    title: req.user

    })
     } else {

   if(!member.roles.cache.has("783251230604132362")) { res.redirect("https://yorum.yorumbey.repl.co/") } else {
    res.render("./panel.ejs", {
    user: req.user

    })
        }
     }
});
  app.get('/panel/:id', async (req, res) => {
        if (!req.user) return res.redirect('/');

        let id = req.params.id;
        let check = false;

       if(!client.guilds.cache.get(id)) return res.redirect("https://discord.com/oauth2/authorize?client_id=796747151266414622&scope=bot&guild_id="+id+"&permissions=8");

        res.render('yonetim.ejs', {
           guild: client.guilds.cache.get(id),
           client: client,
           db: require('croxydb'),
           });
    })

     app.get('/panels/:yapilcaksey', async (req, res) => {
        if (!req.user) return res.redirect('/');


        let yapilcaksey = req.params.id;


const db = require('croxydb')
db.set(yapilcaksey)
console.log(db.fetch(yapilcaksey))
        res.render('index.ejs', {
           title: req.user
           });
    })

 


/////////////////////////////////////////////////////////////////////
    const listener = app.listen(3000, (err) => {

      console.log(`Site hazır.`);
      })

const fs = require('fs')


//////////////////////////////////////////////////
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
   console.log(`🌐 Toplamda ${files.length} Adet Komut Yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
       console.log(`⚡ "${props.help.name}" Adlı Komut Başarıyla Yüklendi.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});
//////////////////////////////////////////////////
client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
//////////////////////////////////////////////////
client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
//////////////////////////////////////////////////
client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};
//////////////////////////////////////////////////
client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};
//////////////////////////////////////////////////

client.login(ayarlar.token)
