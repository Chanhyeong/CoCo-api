FROM ubuntu

RUN apt-get -y update && apt-get -y upgrade && apt-get -y install build-essential
RUN apt-get -y install vim
RUN apt-get -y install sudo
RUN apt-get install -y net-tools openssh-server tree
RUN apt-get -y install default-jre
RUN apt-get install openjdk-7-jdk
RUN echo export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64/ >> /etc/bash.bashrc
RUN mkdir /var/run/sshd
RUN chmod -x /etc/update-motd.d/*
RUN rm /etc/legal
RUN sed -i 's/PrintLastLog yes/PrintLastLog no/' /etc/ssh/sshd_config
RUN sudo service ssh restart
RUN adduser --disabled-password --gecos '' coco
RUN chown coco /home/coco
RUN usermod -aG sudo coco
RUN echo "coco:whdtjf123@" | chpasswd
EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]
