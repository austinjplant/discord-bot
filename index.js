const { Client, GatewayIntentBits } = require('discord.js'); // Declare only once
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = 'MTM2MDkzODc1MjUwNzM4Mzk0NQ.G8nOHT.pQffCP5jNeDxv1VsO5WxnuG5ZikVg0D-RG9rl8'; // Replace this with your actual bot token

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Command handling in a single 'messageCreate' event
client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore bot messages

    // Command: !hello
    if (message.content === '!hello') {
        message.reply('Hey there! 👋');
    }

    // Command: !dm <user_id> <message>
    if (message.content.startsWith('!dm')) {
        const args = message.content.split(' ').slice(1); // Get the args after the command
        const userId = args[0]; // First argument is the user ID
        const dmMessage = args.slice(1).join(' '); // Join the rest of the message text

        if (!userId || !dmMessage) {
            return message.reply('Usage: !dm <user_id> <message>');
        }

        try {
            const user = await client.users.fetch(userId);
            await user.send(`**Message from RFI Productions**: ${dmMessage}`);
            
            const modlogChannel = message.guild.channels.cache.get('1297518590957719673'); // Replace with your channel ID
            if (modlogChannel) {
                modlogChannel.send(`✅ Message sent to <${userId}> by ${message.author.tag}`);
            } else {
                console.log('Modlog channel not found!');
            }
        } catch (err) {
            message.reply('❌ Could not send the DM or find the user.');
        }
    }

    // Command: !dmall <message>
    if (message.content.startsWith('!dmall')) {
        const args = message.content.split(' ').slice(1); // Get the args after the command
        const dmMessage = args.join(' '); // Join the rest of the message text

        if (!dmMessage) {
            return message.reply('Usage: !dmall <message>');
        }

        try {
            const members = await message.guild.members.fetch();
            let delay = 0;
            members.forEach(member => {
                if (member.user.bot) return; // Skip bots
                
                setTimeout(() => {
                    member.send(`📩 **Message from RFI Productions**: ${dmMessage}`).catch(() => {
                        console.log(`Could not send DM to ${member.user.tag}`);
                    });
                }, delay);

                delay += 3000; // Delay for the next DM
            });

            const modlogChannel = message.guild.channels.cache.get('1297518590957719673');
            if (modlogChannel) {
                modlogChannel.send(`✅ Message sent to everyone in the server by ${message.author.tag}`);
            } else {
                console.log('Modlog channel not found!');
            }
        } catch (err) {
            message.reply('❌ Failed to fetch members.');
        }
    }

    // Respond to "Hi" in chat channel
    if (message.channel.id === '1295449741366263810' && (message.content.toLowerCase() === 'hi' || message.content.toLowerCase() === 'hi!')) {
        const chance = Math.random();
        if (chance < 0.3) {
            message.reply('Oh hi!');
        }
    }

    // Help command: !rfihelp
    const serverId = '1295449740896632882';
    if (message.guild?.id === serverId && message.content.toLowerCase() === '!rfihelp') {
        const helpMessage = `
**Here are the available commands:**

1. **!rfihelp** - Displays this help message.
2. **!startactivity** - Starts a voice channel activity (like YouTube Together, Poker, etc.) and invites users.
3. **Hi** - The bot might reply with a random Taylor Swift message (30% chance).
4. **!dm** - Send a direct message to a user by their user ID.
5. **!dmall** - Send a direct message to everyone in the server.
6. **@chat** - The bot will @chat randomly
7. **!rfipoll** - creates a 50/50 poll in #polls

Feel free to try these out and let me know if you need help!`;
        
        message.channel.send(helpMessage);
    }

    // Support trigger phrases
    const content = message.content.toLowerCase();
    const triggerPhrases = [
        'i need help',
        'i found a bug',
        'need help',
        'found a bug',
        'i have a problem',
        'i found an issue'
    ];
    const needsSupport = triggerPhrases.some(phrase => content.includes(phrase));

    if (needsSupport) {
        message.reply('🛠️ Need support? Open a ticket <#1297318987440324729>');
    }
    
    // Random Swiftie messages
    const chatChannel = client.channels.cache.get('1295449741366263810');
    if (!chatChannel || !chatChannel.isTextBased()) return;

    function generateSwiftieMessage() {
        const intros = [
            "@chat What's your favorite",
            "@chat Do you remember",
            "@chat Which one of these is",
            "@chat Have you ever cried to",
            "@chat In your opinion, what's"
        ];

        const subjects = [
            "Taylor Swift song?",
            "Taylor Swift album?",
            "era? (Speak Now, 1989, etc.)",
            "lyric by Taylor?",
            "performance from The Eras Tour?",
            "music video?",
            "surprise song?",
        ];

        const funFacts = [
            "@chat Did you know Taylor wrote 'Love Story' in 20 minutes?",
            "@chat Taylor has 12 Grammys. Which one do you think was most deserved?",
            "@chat In 2020, she released *two* full albums. How iconic is that?",
            "@chat What would your vault track be called?",
            "@chat Imagine Taylor as a fantasy character. What would her power be?"
        ];

        const isFunFact = Math.random() < 0.3;

        if (isFunFact) {
            return funFacts[Math.floor(Math.random() * funFacts.length)];
        } else {
            const intro = intros[Math.floor(Math.random() * intros.length)];
            const subject = subjects[Math.floor(Math.random() * subjects.length)];
            return `${intro} ${subject}`;
        }
    }

    function sendRandomSwiftieMessage() {
        const message = generateSwiftieMessage();
        chatChannel.send(message).catch(console.error);

        const nextDelayMinutes = Math.floor(Math.random() * (600 - 60 + 1)) + 60;
        const nextDelay = nextDelayMinutes * 60 * 1000;

        console.log(`📅 Next Swiftie message in ${nextDelayMinutes} minutes.`);

        setTimeout(sendRandomSwiftieMessage, nextDelay);
    }

    setTimeout(sendRandomSwiftieMessage, 60 * 60 * 1000); // First message after 1 hour
});

// Activity commands
const activities = {
    youtube: '880218394199220334',
    poker: '755827207812677713',
    chess: '832012774040141894',
    sketchheads: '902271654783242291',
    garticphone: '1007373802981822582',
    whiteboard: '1025797832430180433'
};

const voiceChannelId = '1297315633360273448';
client.on('messageCreate', async message => {
    if (message.author.bot || message.guild?.id !== '1295449740896632882') return;

    const args = message.content.trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '!startactivity') {
        const activityKey = args[0]?.toLowerCase();

        if (!activities[activityKey]) {
            return message.reply('❌ Unknown activity. Try: youtube, poker, chess, sketchheads, garticphone, whiteboard');
        }

        const voiceChannel = message.guild.channels.cache.get(voiceChannelId);
        if (!voiceChannel || !voiceChannel.isVoiceBased()) {
            return message.reply('⚠️ Voice channel not found or is not valid.');
        }

        try {
            const invite = await voiceChannel.createInvite({
                targetApplication: activities[activityKey],
                targetType: 2,
                maxAge: 86400,
                maxUses: 0
            });

            const msg = `@chat come join our activity in vc!\n🎮 **${activityKey.toUpperCase()}** → ${invite.url}`;
            message.channel.send(msg);
        } catch (err) {
            console.error(err);
            message.reply('🚫 Failed to start the activity.');
        }
    }
});

// Event countdown command
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Command: !eventcountdown <event_name> <time_unit>
    if (message.content.startsWith('!eventcountdown')) {
        const args = message.content.split(' ').slice(1);
        const eventName = args.slice(0, -1).join(' ').toLowerCase();
        const timeUnit = args[args.length - 1];

        const event = events[eventName];

        if (!event || !event.active) {
            return message.reply(`❌ Event "${eventName}" not found or is inactive.`);
        }

        const eventTime = event.date;
        let countdownTime;

        if (timeUnit.includes("day")) {
            countdownTime = 1000 * 60 * 60 * 24 * parseInt(args[args.length - 2]);
        } else if (timeUnit.includes("hour")) {
            countdownTime = 1000 * 60 * 60 * parseInt(args[args.length - 2]);
        } else if (timeUnit.includes("minute")) {
            countdownTime = 1000 * 60 * parseInt(args[args.length - 2]);
        } else {
            return message.reply("❌ Invalid time unit. Please use 'days', 'hours', or 'minutes'.");
        }

        const timeLeft = eventTime - Date.now();
        const totalCountdown = timeLeft - countdownTime;

        if (totalCountdown <= 0) {
            return message.reply(`The event "${eventName}" has already passed or is too close to the specified countdown.`);
        }

        const countdownMessage = `⏰ The event "${eventName}" will start in ${args[args.length - 2]} ${timeUnit} from now. Stay tuned!`;

        const countdownChannel = await message.guild.channels.fetch(event.channel);
        countdownChannel.send(countdownMessage);
    }

    // Command to cancel event
    if (message.content.startsWith('!cancelevent')) {
        const args = message.content.split(' ').slice(1);
        const eventName = args.join(' ').toLowerCase();

        const event = events[eventName];

        if (!event || !event.active) {
            return message.reply(`❌ Event "${eventName}" not found or is already canceled.`);
        }

        // Mark event as inactive
        event.active = false;

        const countdownChannel = await message.guild.channels.fetch(event.channel);
        countdownChannel.send(`❌ The event "${eventName}" has been canceled.`);

        message.reply(`✅ Event "${eventName}" has been canceled.`);
    }

    // Poll command
    if (message.content.startsWith('!rfipoll')) {
        const args = message.content.split(' ').slice(1);
        const pollQuestion = args.slice(0, -2).join(' '); // Get the question
        const option1 = args[args.length - 2]; // First option
        const option2 = args[args.length - 1]; // Second option

        if (!pollQuestion || !option1 || !option2) {
            return message.reply('❌ Usage: !poll <question> <option_1> <option_2>');
        }

        // Send poll to #polls channel
        const pollChannel = await message.guild.channels.fetch('1308566527540203563'); // Poll channel ID
        if (!pollChannel || !pollChannel.isTextBased()) {
            return message.reply('❌ Poll channel not found!');
        }

        try {
            const pollMessage = await pollChannel.send(`**Poll:** ${pollQuestion}\n\n**Option 1:** ${option1}\n**Option 2:** ${option2}`);

            // React with 50/50 options (✅ and ❌)
            await pollMessage.react('✅'); // First option (Yes)
            await pollMessage.react('❌'); // Second option (No)

            message.reply('✅ Poll created successfully!');
        } catch (error) {
            console.error('Error creating poll:', error);
            message.reply('❌ Something went wrong while creating the poll.');
        }
    }
});

// Bot login
client.login(token);

client.login(token); // Keep the bot login at the end of the file
