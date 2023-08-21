import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    const {user} = useAuthValue();

    const {insertDocument, response} = useInsertDocument("posts");

    const navigate = useNavigate();

    const handleSubmit = (evento) => {
        evento.preventDefault();
        setFormError("");

        try {
            new URL(image);
        } catch (error) {
            setFormError("A imagem precisa ser uma url.");
        }

        const tagsarray = tags.split(",").map(tag => tag.trim().toLowerCase());

        if(!title || !image || !tags || !body) {
            setFormError("Por favor preencha todos os campos.");
        }

        if(formError) return;

        insertDocument({
            title: title,
            image: image,
            body: body,
            tags: tagsarray,
            uid: user.uid,
            createdBy: user.displayName
        });

        navigate("/");

    };

    return (
        <div className={styles.create_post}>
            <h2>Criar post</h2>
            <p>Escreva o que você quiser e compartilhe seu conhecimento!.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Título:</span>
                    <input type="text"  name="title" value={title} required placeholder="Digite o título" onChange={e => setTitle(e.target.value)}/>
                </label>

                <label>
                    <span>Url da imagem:</span>
                    <input type="text"  name="image" value={image} required placeholder="Insira o link da imagem" onChange={e => setImage(e.target.value)}/>
                </label>

                <label>
                    <span>Conteúdo:</span>
                    <textarea name="body" required placeholder="Insira o conteúdo post" value={body} onChange={e => setBody(e.target.value)}></textarea>
                </label>

                <label>
                    <span>Tags:</span>
                    <input type="text"  name="tags" value={tags} required placeholder="Insira as tags separadas por vírgulas" onChange={e => setTags(e.target.value)}/>
                </label>
                {!response.loading && <button className="btn">Cadastrar</button>}
                {response.loading && <button className="btn" disabled>Aguarde...</button>}
                {(response.error || formError) && <p className="error">{response.error || formError}</p>}
            </form>
        </div>
    );
};

export default CreatePost;