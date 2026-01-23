const database = require("../models");
const path = require("path");
const fs = require("fs");
const baseUrl = process.cwd() + "/src"; //__dirname + '.

class AnexoControllers {
  static async anexoIdentidade(req, res) {
    const file = req.file;
    const { id } = req.params;
    const caminho = file.path.split(process.env.SPLIT)[1];
    const nome_arquivo = file.filename;
    const type = file.mimetype;
    const tipo_anexo = "identidade";

    if (type == "application/pdf") {
      try {
        const anexarRG = await database.anexo.create({
          mimetype: type,
          filename: nome_arquivo,
          path: caminho,
          agricultor_id: id,
          tipo_anexo: tipo_anexo,
          raw: true,
        });
        // console.log('anexarParceiro', anexarParceiro)
        return res
          .status(200)
          .json({ message: "Identidade anexado com sucesso!" });
      } catch (error) {
        return res.status(500).json(error.message);
      }
    } else {
      return res.status(500).json({
        message: "Somente arquivo .pdf",
      });
    }
  }

  static async anexoResidencia(req, res) {
    const file = req.file;
    const { id } = req.params;
    const caminho = file.path.split(process.env.SPLIT)[1];
    const nome_arquivo = file.filename;
    const type = file.mimetype;
    const tipo_anexo = "comprovante_residencia";

    if (type == "application/pdf") {
      try {
        const anexarFoto = await database.anexo.create({
          mimetype: type,
          filename: nome_arquivo,
          path: caminho,
          agricultor_id: id,
          tipo_anexo: tipo_anexo,
          raw: true,
        });
        // console.log('anexarParceiro', anexarParceiro)
        return res
          .status(200)
          .json({ message: "Comprovante de residência anexado com sucesso!" });
      } catch (error) {
        return res.status(500).json(error.message);
      }
    } else {
      return res.status(500).json({
        message: "Somente arquivo .pdf",
      });
    }
  }

  static async anexoCPFCNPJ(req, res) {
    const file = req.file;
    const { id } = req.params;
    const caminho = file.path.split(process.env.SPLIT)[1];
    const nome_arquivo = file.filename;
    const type = file.mimetype;
    const tipo_anexo = "comprovante_cpf_cnpj";

    if (type == "application/pdf") {
      try {
        const anexarFoto = await database.anexo.create({
          mimetype: type,
          filename: nome_arquivo,
          path: caminho,
          agricultor_id: id,
          tipo_anexo: tipo_anexo,
          raw: true,
        });
        // console.log('anexarParceiro', anexarParceiro)
        return res
          .status(200)
          .json({ message: "CPF/CNPJ anexado com Sucesso!" });
      } catch (error) {
        return res.status(500).json(error.message);
      }
    } else {
      return res.status(500).json({
        message: "Somente arquivo .pdf",
      });
    }
  }

  static async anexoPropriedade(req, res) {
    const file = req.file;
    const { id } = req.params;
    const caminho = file.path.split(process.env.SPLIT)[1];
    const nome_arquivo = file.filename;
    const type = file.mimetype;
    const tipo_anexo = "comprovante_propriedade";

    if (type == "application/pdf") {
      try {
        const anexarFoto = await database.anexo.create({
          mimetype: type,
          filename: nome_arquivo,
          path: caminho,
          agricultor_id: id,
          tipo_anexo: tipo_anexo,
          raw: true,
        });
        // console.log('anexarParceiro', anexarParceiro)
        return res
          .status(200)
          .json({ message: "Comprovante de propriedade anexado com Sucesso!" });
      } catch (error) {
        return res.status(500).json(error.message);
      }
    } else {
      return res.status(500).json({
        message: "Somente arquivo .pdf",
      });
    }
  }

  //consulta anexo
  static async pegaAnexo(req, res) {
    try {
      const mostraAnexos = await database.anexo.findAll({
        order: ["id"],
        attributes: ["id", "tipo_anexo", "mimetype", "filename", "path"],
        include: [
          {
            association: "ass_anexo_agricultor",
            attributes: ["id", "nome"],
          },
        ],
      });
      return res.status(200).json(mostraAnexos);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaAnexoByType(req, res) {
    const { tipo } = req.params;
    try {
      const mostraAnexo = await database.anexo.findAll({
        where: { tipo_anexo: tipo },
        order: ["id"],
        attributes: ["id", "tipo_anexo", "mimetype", "filename", "path"],
        include: [
          {
            association: "ass_anexo_agricultor",
            attributes: ["id", "nome"],
          },
        ],
      });
      return res.status(200).json(mostraAnexo);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegaAnexoByFarmId(req, res) {
    const { id } = req.params;
    try {
      const mostraAnexo = await database.anexo.findAll({
        order: ["id"],
        where: { agricultor_id: Number(id) },
        attributes: ["id", "tipo_anexo", "mimetype", "filename", "path"],
        include: [
          {
            association: "ass_anexo_agricultor",
            attributes: ["id", "nome"],
          },
        ],
      });
      mostraAnexo.path = __dirname + mostraAnexo.path;
      //console.log('mostraAnexos.path', mostraAnexo.path)
      return res.status(200).json(mostraAnexo);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async pegarArquivoById(req, res) {
    const { id } = req.params;
    const { tipo_anexo } = req.query;

    try {
      const mostraAnexo = await database.anexo.findOne({
        where: { agricultor_id: Number(id), tipo_anexo: tipo_anexo },
        attributes: ["id", "tipo_anexo", "path", "mimetype", "filename"],
      });

      if (!mostraAnexo) {
        return res.status(404).json({ message: "Arquivo não encontrado" });
      }

      const filePath = path.join(baseUrl, mostraAnexo.path);

      if (!fs.existsSync(filePath)) {
        return res
          .status(404)
          .json({ message: "Arquivo não existe no servidor" });
      }

      // Decide o MIME type:
      let mimetype = mostraAnexo.mimetype;

      // Caso você queira forçar pelo tipo_anexo:
      if (!mimetype) {
        if (mostraAnexo.tipo_anexo === "foto") mimetype = "image/jpeg";
        else if (mostraAnexo.tipo_anexo === "titulo_eleitor")
          mimetype = "image/jpeg";
        else mimetype = "application/pdf"; // padrão
      }

      fs.readFile(filePath, { encoding: "base64" }, (err, base64Data) => {
        if (err)
          return res.status(500).json({ message: "Erro ao ler arquivo" });

        return res.status(200).json({
          base64: base64Data,
          mimetype: mimetype,
          filename: mostraAnexo.filename,
          tipo_anexo: mostraAnexo.tipo_anexo,
          id_anexo: mostraAnexo.id,
        });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro no servidor", error: error.message });
    }
  }

  static async atualizarAnexo(req, res) {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: "Nenhum arquivo enviado para atualização",
      });
    }

    try {
      // 1️⃣ Busca o anexo existente no banco
      const anexoExistente = await database.anexo.findOne({
        where: { id: Number(id) },
      });

      if (!anexoExistente) {
        return res.status(404).json({ error: "Anexo não encontrado" });
      }

      // 2️⃣ Se houver arquivo antigo, deleta do servidor
      const fs = require("fs");
      const path = require("path");

      if (anexoExistente.path) {
        const caminhoAntigo = path.join(
          process.cwd(), // raiz do projeto
          process.env.SPLIT, // src
          anexoExistente.path, // caminho armazenado no banco
        );
        console.log("caminhoAntigo", caminhoAntigo);

        if (fs.existsSync(caminhoAntigo)) {
          fs.unlinkSync(caminhoAntigo);
          console.log("Arquivo antigo deletado:", caminhoAntigo);
        } else {
          console.warn("Arquivo antigo não existe:", caminhoAntigo);
        }
      }
      // 3️⃣ Pega o novo caminho
      const novoCaminho = file.path.split(process.env.SPLIT)[1];
      console.log("novoCaminho", novoCaminho);

      // remove a primeira barra caso exista
      const novoCaminhoLimpo = novoCaminho.startsWith("/")
        ? novoCaminho.substring(1)
        : novoCaminho;

      // 4️⃣ Atualiza o banco
      await database.anexo.update(
        { path: novoCaminhoLimpo },
        { where: { id: Number(id) } },
      );

      // 5️⃣ Retorna o anexo atualizado
      const atualizado = await database.anexo.findOne({
        where: { id: Number(id) },
      });

      return res.status(200).json(atualizado);
    } catch (error) {
      console.error("Erro ao atualizar anexo:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  static async checkFileById(req, res) {
    const { id } = req.params;
    try {
      const mostraAnexo = await database.anexo.findAll({
        order: ["id"],
        where: { agricultor_id: Number(id) },
        attributes: ["tipo_anexo"],
      });
      mostraAnexo.path = __dirname + mostraAnexo.path;
      //console.log('mostraAnexos.path', mostraAnexo.path)
      return res.status(200).json(mostraAnexo);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  }

  static async deletarAnexo(req, res) {
    const { id } = req.params;

    try {
      // 1️⃣ Buscar o anexo pelo ID
      const anexo = await database.anexo.findOne({
        where: { id: Number(id) },
      });

      if (!anexo) {
        return res.status(404).send({
          mensagem: "Anexo não encontrado!",
        });
      }

      // Caminho do arquivo no servidor
      const caminhoArquivo = path.join(baseUrl, anexo.path);

      // 2️⃣ Verificar se o arquivo existe antes de deletar
      fs.access(caminhoArquivo, fs.constants.F_OK, async (erro) => {
        // 3️⃣ Remover registro do banco primeiro
        await database.anexo.destroy({ where: { id: Number(id) } });

        // Se arquivo não existir, apenas remove o registro e retorna sucesso
        if (erro) {
          return res.status(200).send({
            mensagem:
              "Registro removido, mas o arquivo não existia no servidor.",
          });
        }

        // 4️⃣ Arquivo existe → deletar
        fs.unlink(caminhoArquivo, (err) => {
          if (err) {
            console.error("Erro ao excluir arquivo:", err);
            return res.status(500).send({
              mensagem:
                "Registro apagado, mas ocorreu erro ao excluir o arquivo.",
            });
          }

          return res.status(200).send({
            mensagem: "Anexo excluído com sucesso!",
          });
        });
      });
    } catch (error) {
      console.error("Erro no deleteAnexo:", error);
      return res.status(500).send({
        mensagem: "Erro interno ao excluir anexo.",
        detalhes: error.message,
      });
    }
  }
}

module.exports = AnexoControllers;
