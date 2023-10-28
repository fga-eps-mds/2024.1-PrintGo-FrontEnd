# PrintGo Frontend

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fga-eps-mds_2023.2-PrintGo-FrontEnd&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=fga-eps-mds_2023.2-PrintGo-FrontEnd)

[![codecov](https://codecov.io/gh/fga-eps-mds/2023.2-PrintGo-FrontEnd/graph/badge.svg?token=Lw95zaXoXc)](https://codecov.io/gh/fga-eps-mds/2023.2-PrintGo-FrontEnd)

# 1. Clone o projeto
git clone git@github.com:fga-eps-mds/2023.2-PrintGo-FrontEnd.git

# 2. Entre na pasta do projeto
cd 2023.2-PrintGo-FrontEnd

# Construa a imagem do docker 
```bash 
sudo docker build -t frontprintgo .
```
# Execute o container
```bash 
sudo docker run -p 3000:3000 frontprintgo 
```
# Caso os comando acima falhem, utilize:
```bash 
sudo docker-compose up --build
```
```bash 
sudo docker-compose up
```
