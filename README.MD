### Server running as a service on alpha /home/dave/projects/property-inspector.service

https://natancabral.medium.com/run-node-js-service-with-systemd-on-linux-42cfdf0ad7b2

old https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service

file is sudo nano /etc/systemd/system/property-inspector.service
sudo systemctl start property-inspector
note: in this file environment node_env=prod is set to hide stack traces on error

don't forget to rebuild server!!!
