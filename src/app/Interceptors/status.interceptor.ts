import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';


@Injectable({
    providedIn: 'root'
})

export class StatusHttpInterceptor implements HttpInterceptor {

    constructor() {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {

            if (error.status === 401) {

                debugger;
                // se borra el token guardado y se reinicia la pagina para luego redireccionar con el Guard                
                localStorage.clear();
                window.location.reload();
            }
            return throwError(error);
        }));
    }
}