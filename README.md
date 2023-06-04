
## Graphics Pipeline Demonstration

This repo is a fork of [SimonGreyHull/applicantDemonstrations](https://github.com/SimonGreyHull/applicantDemonstrations).

I wanted to try refactoring existing JavaScript code into TypeScript with ES6 modules.

```tsc -w``` recompiles any .ts file changes made in the ```/src``` folder.

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ES2015",
    "outDir": "./docs",
    "rootDir": "./src",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,        
    "strict": true,                                
    "skipLibCheck": true                                 
  },
  "include": ["src"]
}
```

GitHub Pages needs pointing to ```/docs```, and should look like [this](https://eeoooue.github.io/applicantDemonstrations/).

