import styles from "./Login.module.css";
import { useAuthentication } from "../../hooks/useAuthentication";

import { useState, useEffect } from "react";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const {login, error: authError, loading} = useAuthentication();

    const handleSubmit = async (evento) => {
        evento.preventDefault();
        

        setError("");

        const user ={
            email: email,
            password: password
        };

        const res = await login(user);

        // setEmail("");
        // setPassword("");
    };

    useEffect(() => {
        if(authError){
            setError(authError);
        }
    },[authError]);
    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>faça o login para poder compartilhe suas histórias</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>E-mail:</span>
                    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="E-mail do usuário" />
                </label>

                <label>
                    <span>Senha:</span>
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Digite sua senha" />
                </label>

                {!loading && <button className="btn">Entrar</button>}
                {loading && <button className="btn" disabled>Aguarde...</button>}
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default Login;