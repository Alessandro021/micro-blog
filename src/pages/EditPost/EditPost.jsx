import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useUpdateDocument } from "../../hooks/useUpdateDocument"; 
import {useFetchDocument} from "../../hooks/useFetchDocument"; 

const EditPost = () => {
    const {id: idPost} = useParams();
    const {document: post} = useFetchDocument("posts", idPost);
 
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if(post){
            setTitle(post.title);
            setImage(post.image);
            setBody(post.body);
            // console.log(post.tags);
            setTags(post.tags);
        } 
    },[post]);

    const {user} = useAuthValue();

    const {updateDocument, response} = useUpdateDocument("posts");

    const navigate = useNavigate();

    const handleSubmit = (evento) => {
        evento.preventDefault();
        setFormError("");

        try {
            new URL(image);
        } catch (error) {
            setFormError("A imagem precisa ser uma url.");
        }

        // const tagsarray = tags.split(",").map(tag => tag.trim().toLowerCase());

        if(!title || !image || !tags || !body) {
            setFormError("Por favor preencha todos os campos.");
        }

        if(formError) return;

        const data = {
            title: title,
            image: image,
            body: body,
            tags: tags,
            uid: user.uid,
            createdBy: user.displayName
        };

        updateDocument(idPost, data);

        navigate("/dashboard");

    };

    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h2>Editando post: {post.title}</h2>
                    <p>Altere os dados do post que seja necessario.</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Título:</span>
                            <input type="text"  name="title" value={title} required placeholder="Digite o título" onChange={e => setTitle(e.target.value)}/>
                        </label>

                        <label>
                            <span>Url da imagem:</span>
                            <input type="text"  name="image" value={image} required placeholder="Insira o link da imagem" onChange={e => setImage(e.target.value)}/>
                        </label>
                        <p className={styles.preview_title}>Preview da imagem atual:</p>
                        <img className={styles.image_preview} src={post.image} alt={post.title} />

                        <label>
                            <span>Conteúdo:</span>
                            <textarea name="body" required placeholder="Insira o conteúdo post" value={body} onChange={e => setBody(e.target.value)}></textarea>
                        </label>

                        <label>
                            <span>Tags:</span>
                            <input type="text"  name="tags" value={tags} required placeholder="Insira as tags separadas por vírgulas" onChange={e => setTags(e.target.value)}/>
                        </label>
                        {!response.loading && <button className="btn">Atualizar</button>}
                        {response.loading && <button className="btn" disabled>Aguarde...</button>}
                        {(response.error || formError) && <p className="error">{response.error || formError}</p>}
                    </form>
                </>
            )}
        </div>
    );
};

export default EditPost;