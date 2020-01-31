Deploy:

To receive server access ask someone from backend unit for adding 
your public SSH key

```shell script
ssh ladmin@172.31.248.19
cd /srv/app 

#OPTIONAL
#ensure that you going to pull right docker image
#(if build branch master - then APP_TAG=master etc)
cat .env

./deploy.sh

```