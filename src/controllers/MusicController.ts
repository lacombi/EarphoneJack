import { Message, MessageEmbed } from 'discord.js';
import ytdl from 'ytdl-core';

let playlist: string[] = [];
let volume = 0.5;

class MusicController {
  private message: Message;

  constructor(message: Message) {
    this.message = message;
  }

  async getConnection() {
    const connection = await this.message.member?.voice.channel?.join();

    return connection;
  }

  async play() {
    const connection = await this.getConnection();

    const dispatcher = connection?.play(ytdl(playlist[0], { quality: 'highestaudio' }), { volume });

    const songInfo = await ytdl.getInfo(playlist[0]);

    const embed = new MessageEmbed();

    embed.setColor('#ffd596');
    embed.setTitle(`Tocando agora ${songInfo.videoDetails.title}`);

    this.message.channel.send(embed);
  
    dispatcher?.on('finish', () => {
      playlist.shift();
      playlist.length >= 1 ? this.play() : this.stop();
    });
  }

  async skip() {
    const connection = await this.getConnection();
    connection?.dispatcher.end();
  }

  async stop() {
    playlist = [];
    this.message.member?.voice.channel?.leave();

    const embed = new MessageEmbed();

    embed.setColor('#ffd596');
    embed.setTitle('Que pena, a festa acabou.');

    return this.message.channel.send(embed);
  }

  async setVolume(newVolume: number) {
    const connection = await this.getConnection();

    volume = newVolume;

    connection?.dispatcher.setVolume(newVolume);
  }
}

export { MusicController, playlist };