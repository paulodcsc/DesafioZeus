const Database = require('../db/config')

module.exports = {
  async create(req, res) {
    const db = await Database()
    const email = req.body.email
    const pass = req.body.pass

    console.log(email + ' ' + pass)

    let roomId
    let isRoom = true
    while (isRoom) {
      /* Gerar o numero da sala */
      for (var i = 0; i < 6; i++) {
        i == 0
          ? (roomId = Math.floor(Math.random() * 10).toString())
          : (roomId += Math.floor(Math.random() * 10).toString())
      }

      /* Verificar se esse numero ja existe */
      const roomsExistIds = await db.all(`SELECT id FROM rooms`)
      isRoom = roomsExistIds.some(roomExistId => roomExistId === roomId)

      if (!isRoom) {
        /* Insere a sala no banco */
        await db.run(`INSERT INTO rooms (
                    id,
                    email,
                    pass
                ) VAlUES (
                    ${parseInt(roomId)},
                    '${email}',
                    '${pass}'
                )`)
      }
    }

    await db.close()

    res.redirect(`/room/${roomId}`)
  },

  async open(req, res) {
    const db = await Database()
    const roomId = req.params.room
    const questions = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 0`
    )
    const questionsRead = await db.all(
      `SELECT * FROM questions WHERE room = ${roomId} and read = 1`
    )
    let isNoQuestions

    if (questions.length == 0) {
      if (questionsRead.length == 0) {
        isNoQuestions = true
      }
    }

    res.render('room', {
      roomId: roomId,
      questions: questions,
      questionsRead: questionsRead,
      isNoQuestions: isNoQuestions
    })
  },

  async enter(req, res) {
    const db = await Database()
    const email = req.body.email
    const pass = req.body.pass

    console.log(email + ' ' + pass)

    const r = await db.all(
      `SELECT * FROM rooms WHERE email = '${email}' and pass = '${pass}'`
    )

    const roomId = r[0].id

    res.redirect(`/room/${roomId}`)
  }
}
