import { UsuarioEntities } from "./UsuarioEntities.model";

export interface AutenticationEntities {
    usuario?: UsuarioEntities
    token?: string
}
