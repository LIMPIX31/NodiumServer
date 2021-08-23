import nodemailer from "nodemailer"

export const mailService = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mcb.mcserver@gmail.com',
      pass: 'MCBmcServer278945'
    },
    secure: false
  }),
  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to,
      subject: 'Активация аккаунта #MCB',
      text: '',
      html: `
      <div>
      <h1>Вы зарегестрировались на #MCB, активируйте аккаунт, перейдя по ссыке ниже</h1>
      <br>
      <a href="${link}">${link}</a>
      <br>
      <br>
      <span>Если вы не регестрировались на #MCB, то проигнорируйте это письмо</span>
</div>
      `
    })
  }
}
