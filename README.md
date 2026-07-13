# Proyecto-02-Mini-emprendedor
Taller de niños acerca del emprendimiento.

Link al repositorio en Figma con los mockups:
https://www.figma.com/design/HKNFxU811mmbG7zZdL3Cw9/EMPRENDEKIDS-IA-%E2%80%94-Prototipo-MVP?node-id=0-1&p=f

Link al repostorio en Figma con la version 2 de los mockups:
https://www.figma.com/make/mW7o460mJZp4g4QBzuWb46/EmprendeKids-IA-App?p=f

Link a la pagina subida en Vercel:
https://emprendekidsia.vercel.app/

Link a Supabase:
https://urmfsyhisktlzosppent.supabase.co

Link al levantamiento de requerimientos y manual de usuario:
https://docs.google.com/document/d/1Aaw5mjwTWogRvFLcTIDflDeSx00q7BRUehI0lWUyJwE/edit?usp=sharing

## Pasos rapidos para iniciar el proyecto
Copear el repositorio a tu PC
```bash
git clone https://github.com/AxelOrtiz31/Proyecto-02-Mini-emprendedor.git
```

Recibir los cambios de otros
```bash
git pull
```

Recibir los cambios de la rama principal (origin main)
```bash
git pull origin main
```

Para más información lea la parte de mas abajo (▀̿Ĺ̯▀̿ ̿)


## Actividad Git
Este es el commit de Axel

Este es el commit de Kevin

Este es el commit de Aramis

Este es el commit de Alexis

Este es el commit de Carlos

Este es el commit de Erik

Este es el commit de Elsy

## Instalacion de Node.js
Node.js es un entorno de ejecución para JavaScript que permite ejecutar código fuera del navegador.
Es necesario para ejecutar Next en la PC.

Descarga e instala en:  
https://nodejs.org/es/download

Verificar que la instalación fue correcta:

```bash
node --version
npm --version
```

## Crear proyecto con Next.js
Next.js es un framework basado en React (biblioteca de JS) que facilita crear aplicaciones web completas y optimizadas.

Comandos para crear app e iniciarla:

```bash
npx create-next-app@latest mini_emprendedores --yes
cd mini_emprendedores
npm run dev
```

## Guia rapida del framework Next
Carpetas y archivos:
1. .next → Archivos generados por la compilación.
2. app → Páginas, layouts y rutas de la aplicación.
3. components → Componentes reutilizables (se usan en app).
4. database → Configuración y lógica de base de datos.
5. node_modules → Dependencias instaladas por npm.
6. public → Recursos estáticos (imágenes, iconos, etc.).
7. packache-lock.json → Versiones exactas de dependencias.
8. package.json → Configuración, scripts y dependencias del proyecto.
9. controllers → Procesa solicitudes.


## Dependencias instaladas
Supabase:
```bash
npm install @supabase/supabase-js
npm install howler
```

Para instalar las dependencias agrega esto a package.json en "dependencies":
```
"@supabase/supabase-js": "^2.108.2",
```

Comandos para usar npm, si no se especifica una libreria despues el comando tendra un comportamiento global:
```bash
npm install
npm uninstall
npm update
```

### Comandos para solucionar errores
Si el proyecto tiene errores con las dependencias, next, etc, y al arrancar te salen errores, ejecuta los siguientes comandos, si tienes Windows:
```bash
rmdir /s /q .next
rmdir /s /q node_modules
del package-lock.json

npm install
npm run dev
```

Si tienes Mac:
```bash
rm -rf .next
rm -rf node_modules
rm package-lock.json

npm install
npm run dev
```

## Guía rápida para colaborar en el proyecto

### 1. Clonar el repositorio
Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/AxelOrtiz31/Proyecto-02-Mini-emprendedor
```

### 2. Verificar el correo configurado en Git

Antes de realizar commits, verifica que Git esté utilizando tu correo correcto:

#### Correo global

```bash
git config --global user.email
```

#### Correo del repositorio actual

```bash
git config user.email
```

Si el correo no es el correcto, actualízalo antes de realizar commits.

### 3. Subir cambios al repositorio

Una vez realizados los cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push -u origin main
```

### 4. Obtener cambios realizados por otros integrantes

Si algún compañero ha subido cambios al repositorio, actualiza tu copia local con:

```bash
git pull
```

> **Recomendación:** Ejecuta `git pull` antes de comenzar a trabajar para asegurarte de tener la versión más reciente del proyecto.

### 5. Deshacer un cambio reciente

En caso de haber hecho un pull de todas las ramas a tu maquina local usa el siguiente comando para revertirlo, solo funciona con un commit a la vez:

```bash
git reset --hard ORIG_HEAD
```

```bash
git merge --abort
```