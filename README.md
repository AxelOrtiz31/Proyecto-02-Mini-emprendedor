# Proyecto-02-Mini-emprendedor
Taller de niños acerca del emprendimiento.

Link al repositorio en Figma con los mockups:
https://www.figma.com/design/HKNFxU811mmbG7zZdL3Cw9/EMPRENDEKIDS-IA-%E2%80%94-Prototipo-MVP?node-id=0-1&p=f


## Actividad Git
Este es el commit de Axell
Este es el commit 2 de Kevinn
Este es el commit de Alexis
Este es el commit de Carlos
Este es el commit de Erik

## Instalacion de Node.js
Node.js es un entorno de ejecución para JavaScript que permite ejecutar código fuera del navegador.

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