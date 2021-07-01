create database db_Syndicat
use db_Syndicat 

create table logement (RefLogement varchar(30) primary key, type varchar(50) not null, NumCompteCop int not null)

ALTER TABLE logement add CONSTRAINT fk_log_compte FOREIGN KEY (NumCompteCop) REFERENCES compte(NumCompte)

create table reclamation (RefReclamation int primary key auto_increment, RefLogement varchar(30) not null, Objet varchar(100) not null, Message text, 
						  dateReclamation date default current_timestamp(), statut varchar(20) default 'Envoyé' 

ALTER TABLE reclamation add CONSTRAINT pour_val CHECK (pour in ('Privée', 'Public'))

ALTER TABLE reclamation add CONSTRAINT statut_val CHECK (statut in ('Envoyé', 'En cours', 'Résolue', 'Echoué'))

ALTER TABLE reclamation add CONSTRAINT fk_rec_log FOREIGN KEY (RefLogement) REFERENCES logement(RefLogement)

create table Support (NumSupport int primary key auto_increment, RefReclamation int not null, contenu varchar(100) not null)

ALTER TABLE Support add CONSTRAINT fk_rec_sup FOREIGN KEY (RefReclamation) REFERENCES reclamation(RefReclamation)

create table compte (NumCompte int primary key auto_increment, NomCompte varchar(30) not null, PrenomCompte varchar(30) not null, Role varchar(20) Not null,
					 EmailCompte varchar(50) not null unique, telephone varchar(10), fonc varchar(20) not null, PasswordCompte varchar(100), isActive bit default 1)

alter table compte add constraint role_val check (role in ('Admin', 'Copropriétaire')

create table paiement (RefPaiment varchar(50) primary key, RefLogement varchar(30) not null, NumCompte int not null, datePaiement date default current_timestamp(),
					   NbrMois int default 1, MethodePaiement varchar(10) default 'Espèce', Montant double not null)

alter table paiement add CONSTRAINT methode_val CHECK (MethodePaiement in ('Espèce', 'Chèque'))

alter table paiement add CONSTRAINT fk_compte_pai FOREIGN KEY (NumCompte) REFERENCES compte(NumCompte)

alter table paiement add CONSTRAINT fk_log_pai FOREIGN KEY (RefLogement) REFERENCES logement(RefLogement)	

create table cheque (NumCheque int primary key auto_increment, RefPaiement varchar(50) not null, Banque varchar(30) not null)

alter table cheque add CONSTRAINT fk_che_pai FOREIGN KEY (RefPaiement) REFERENCES paiement(RefPaiement)	

create table calendrier (RefCalendrier int primary key auto_increment, RefPaiement varchar(50) not null, Du date, Au date) 

alter table calendrier add CONSTRAINT fk_cale_pai FOREIGN KEY (RefPaiement) REFERENCES paiement(RefPaiement)

create table annonce (RefAnnonce int primary key auto_increment, NumCompte int not null, dateAnnonce date default current_timestamp(), Sujet varchar(100) not null,
					  DescripAnnonce text, statut bit default 1)

alter table annonce add CONSTRAINT fk_ann_compte FOREIGN KEY (NumCompte) REFERENCES compte(NumCompte)

create table document (RefDocument int primary key auto_increment, RefAnnonce int not null, contenuDocument varchar(100) not null)

alter table document add CONSTRAINT fk_ann_doc FOREIGN KEY (RefAnnonce) REFERENCES annonce(RefAnnonce)


create table categorie (NomCategorie varchar(50) primary key)

create table depense (RefDepense int primary key auto_increment, NumCompte int not null, NomCategorie varchar(50) not null, dateDepense date default current_timestamp(),
					  MontantDepense double not null, facture varchar(50) not null)

alter table depense add CONSTRAINT fk_dep_cat FOREIGN KEY (NomCategorie) REFERENCES categorie(NomCategorie)

alter table depense add CONSTRAINT fk_dep_compte FOREIGN KEY (NumCompte) REFERENCES compte(NumCompte)

