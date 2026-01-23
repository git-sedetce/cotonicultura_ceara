const database = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

class UserController {
  static async cadastraUser(req, res) {
    try {
      const novoUser = req.body;

      if (!novoUser.user_password || !novoUser.user_email) {
        return res.status(400).json({ message: "Dados obrigatórios ausentes" });
      }

      const salt = await bcrypt.genSalt(10);
      novoUser.user_password = await bcrypt.hash(novoUser.user_password, salt);
      novoUser.user_pin = Math.floor(1000 + Math.random() * 9000);
      novoUser.profile_id = 4;
      novoUser.user_active = false;

      const userCriado = await database.user.create(novoUser);

      // Remove a senha antes de responder
      const { user_password, ...data } = userCriado.toJSON();

      // 🔹 Retorna o cadastro imediatamente
      res.status(201).json(data);

      // 🔹 Envio de e-mails em background
      UserController.enviarEmailsCadastro(novoUser).catch((err) =>
        console.error("Erro ao enviar e-mail:", err),
      );
    } catch (error) {
      console.error(error);
      if (!res.headersSent) {
        return res.status(500).json({ message: error.message });
      }
    }
  }

  static async enviarEmailsCadastro(user) {
    const transporter = nodemailer.createTransport({
      host: "172.26.2.26",
      port: 25,
      secure: false,
      tls: { rejectUnauthorized: false },
    });

    // Email administrativo
    await transporter.sendMail({
      from: "cotec@sde.ce.gov.br",
      to: process.env.EMAIL_ADMIN,
      subject: "Cadastro de usuário do Sistema de Cotonicultura da SDE",
      html: `
      <h3>Cadastro realizado com sucesso</h3>
      <p>${user.nome_completo} realizou o cadastro.</p>
    `,
    });

    // Email com PIN
    await transporter.sendMail({
      from: "cotec@sde.ce.gov.br",
      to: user.user_email,
      subject: "Código PIN - Sistema de Cotonicultura da SDE",
      html: `
      <h2>Código PIN</h2>
      <h3>${user.user_pin}</h3>
      <p>
        <a href="https://www.cotonicultura.sde.ce.gov.br/resetSenha">
          Clique aqui para criar sua senha
        </a>
      </p>
    `,
    });
  }

  static async checarEmail(req, res) {
    const { email } = req.params;
    try {
      const verificaEmail = await database.user.findOne({
        where: { user_email: email },
        attributes: ["user_name", "user_email"],
      });
      if (verificaEmail === null) {
        return res
          .status(200)
          .json({ mensagem: `Email autorizado para cadastro` });
      } else {
        return res.status(200).json({ mensagem: `Email já cadastrado!` });
      }
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async gerarPin(req, res) {
    const user = req.body;
    //console.log('user', user)
    try {
      const verificaUser = await database.user.findOne({
        where: { user_email: user.user_email },
      });
      if (!verificaUser) {
        return res.status(404).send({ message: "Usuário não encontrado!" });
      }
      let newPin = Math.floor(1000 + Math.random() * 9000);
      user.user_pin;

      const novoPin = await database.user.update(
        { user_pin: newPin },
        { where: { user_email: user.user_email } },
      );

      res.send({ message: "Pin alterado com sucesso!" });

      var transporter = nodemailer.createTransport({
        host: "172.26.2.26", //relay.etice.ce.gov.br
        port: 25,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
      });

      var mailOptions = {
        from: "cotec@sde.ce.gov.br",
        to: user.user_email,
        subject: "Novo Pin para nova senha",
        html: `<h3>Segue o novo Pin!!</h3><p><strong>${newPin}</strong><br>Crie sua nova senha no seguinte link: <a href="https://cotonicultura.sde.ce.gov.br/resetSenha">Resetar Senha</a>`,
      };
      //   console.log("mailOptions", mailOptions);
      var emailRetorno = null;
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error(error);
          emailRetorno = error;
        } else {
          //   console.log("Email enviado: " + info.response);
          emailRetorno = {
            messagem: "Email enviado com sucesso!",
            info: info.response,
          };
        }
      });
    } catch (error) {
      //res.send(verificaUserEmail)
      return res.status(500).json(error.message);
    }
  }

  static async login(req, res) {
    const user = req.body;

    try {
      const verificaUser = await database.user.findOne({
        where: { user_email: user.user_email },
      });
      if (!verificaUser) {
        return res.status(404).send({ message: "Usuário não encontrado!" });
      }
      if (!verificaUser.user_active) {
        return res
          .status(400)
          .send({ message: "Consulte o Administrador do sistema" });
      }
      if (
        !(await bcrypt.compare(user.user_password, verificaUser.user_password))
      ) {
        return res.status(400).send({ message: "Crendenciais inválidos!" });
      }
      const token = jwt.sign(
        {
          _id: verificaUser.id,
          _profile_id: verificaUser.profile_id,
          _user_name: verificaUser.user_name,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "8h",
        },
      );
      return res.json({
        auth: true,
        token: token,
        message: "Usuário logado com sucesso!",
      });
    } catch (error) {
      res.send({ message: "Problemas ao realizar login!" });
    }
  }

  static async pegaUsers(req, res) {
    try {
      const getUser = await database.user.findAll({
        order: [["nome", "ASC"]],
        attributes: [
          "id",
          "nome",
          "user_name",
          "user_email",
          "user_active",
          "profile_id",
          "sexec_id",
        ],
        include: [
          {
            association: "ass_user_profile",
            attributes: ["id", "perfil"],
          },
          {
            association: "ass_user_sexec",
            attributes: ["id", "secretaria", "sigla"],
          },
        ],
      });

      return res.status(200).json(getUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  }

  static async pegaSexec(req, res) {
    try {
      const getSexec = await database.secretaria_executiva.findAll({
        order: ["secretaria"],
        attributes: ["id", "secretaria", "sigla"],
      });
      return res.status(200).json(getSexec);
    } catch (error) {
      return res.status(500).json({ message: "Secretaria não encontrado" });
    }
  }

  static async atualizaUser(req, res) {
    const { id } = req.params;
    const user = req.body;
    // console.log('user', user)
    try {
      await database.user.update(user, { where: { id: Number(id) } });
      const updateUser = await database.user.findOne({
        where: { id: Number(id) },
      });
      return res.status(200).json(updateUser);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async logout(req, res) {
    res.cookie("jwt", "", { maxAge: 0 });
    res.send({ message: "Logout Success!" });
  }

  static async resetPassword(req, res) {
    const user = req.body;
    //console.log('user', user)
    try {
      const verificaUser = await database.user.findOne({
        where: { user_email: user.user_email },
      });
      if (!verificaUser) {
        return res.status(404).send({ message: "Usuário não encontrado!" });
      }
      let newPassword = user.user_password;
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      newPassword = hashedNewPassword;
      //console.log('newPassword', newPassword)

      if (verificaUser.user_active === false) {
        const novaSenha = await database.user.update(
          { user_password: newPassword },
          { where: { user_email: user.user_email } },
        );
      } else {
        const novaSenha = await database.user.update(
          { user_password: newPassword },
          { where: { user_email: user.user_email } },
        );
      }

      //const  result = await novaSenha.save()
      //const { password, ...data } = await result.toJSON()
      res.send({ message: "Senha alterada com sucesso!" });
    } catch (error) {
      //res.send(verificaUserEmail)
      return res.status(500).json(error.message);
    }
  }

  static async deletaUsers(req, res) {
    const { id } = req.params;

    const apaga = await database.user.findOne({
          where: { id: Number(id) },
          attributes: ["nome"],
        });

    try {
      await database.user.destroy({ where: { id: Number(id) } });
      return res.status(200).json({
        mensagem: `O Usuario ${apaga.nome} foi excluido com sucesso!!`,
      });
    } catch (erro) {
      return res.status(500).json(erro.message);
    }
  }
}

module.exports = UserController;
