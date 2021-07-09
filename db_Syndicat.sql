create database db_Syndicat
use db_Syndicat 

create table logement (RefLogement varchar(30) primary key, type varchar(50) not null, NumCompteCop int not null)

ALTER TABLE logement add CONSTRAINT fk_log_compte FOREIGN KEY (NumCompteCop) REFERENCES compte(NumCompte)

create table reclamation (RefReclamation int primary key auto_increment, RefLogement varchar(30) not null, Objet varchar(100) not null, Message text, 
						  dateReclamation date default current_timestamp(), statut varchar(20) default 'Envoy�' 

ALTER TABLE reclamation add CONSTRAINT pour_val CHECK (pour in ('Priv�e', 'Public'))

ALTER TABLE reclamation add CONSTRAINT statut_val CHECK (statut in ('Envoy�', 'En cours', 'R�solue', 'Echou�'))

ALTER TABLE reclamation add CONSTRAINT fk_rec_log FOREIGN KEY (RefLogement) REFERENCES logement(RefLogement)

create table Support (NumSupport int primary key auto_increment, RefReclamation int not null, contenu varchar(100) not null)

ALTER TABLE Support add CONSTRAINT fk_rec_sup FOREIGN KEY (RefReclamation) REFERENCES reclamation(RefReclamation)

create table compte (NumCompte int primary key auto_increment, NomCompte varchar(30) not null, PrenomCompte varchar(30) not null, Role varchar(20) Not null,
					 EmailCompte varchar(50) not null unique, telephone varchar(10), fonc varchar(20) not null, PasswordCompte varchar(100), isActive bit default 1)

alter table compte add constraint role_val check (role in ('Admin', 'Copropri�taire')

create table paiement (RefPaiment varchar(50) primary key, RefLogement varchar(30) not null, NumCompte int not null, datePaiement date default current_timestamp(),
					   NbrMois int default 1, MethodePaiement varchar(10) default 'Esp�ce', Montant double not null)

alter table paiement add CONSTRAINT methode_val CHECK (MethodePaiement in ('Esp�ce', 'Ch�que'))

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




DELIMITER $$
	create procedure inert_paiement_cheque(IN paied varchar(50), IN log varchar(30), IN id int, IN mois int, IN methode varchar(10), IN montant double, IN NumeroCheque varchar(30), IN bnq varchar(30))
	begin
		insert into paiement (RefPaiement, RefLogement, NumCompte, NbrMois, MethodePaiement, Montant) values (paied, log, id, mois, methode, montant);
		insert into cheque (RefPaiement, Banque, NumeroCheque) values (paied, bnq, NumeroCheque);
	END $$
DELIMITER ;




DELIMITER $$
begin
DECLARE duu date DEFAULT '2021-01-01';
 if(SELECT duu = date_add(c.Au, INTERVAL 1 month) FROM calendrier c, paiement p where c.RefPaiement = p.RefPaiement AND p.RefLogement = old.RefLogement order by c.RefCalendrier DESC LIMIT 1)
 insert INTO calendrier (RefPaiement, Du, Au) VALUES (old.RefPaiement, duu, date_add(duu, INTERVAL old.NbrMois month));
ELSE
insert INTO calendrier (RefPaiement, Du, Au) VALUES (old.RefPaiemant, '2021-01-01', date_add('2021-01-01', INTERVAL old.NbrMois));
end $$
DELIMITER ;




DELIMITER $$
	create procedure inert_paiement_cheque(IN paied varchar(50), IN log varchar(30), IN id int, IN mois int, IN methode varchar(10), IN montant double, IN NumeroCheque varchar(30), IN bnq varchar(30))
	begin
		DECLARE duu VARCHAR(40);
		insert into paiement (RefPaiement, RefLogement, NumCompte, NbrMois, MethodePaiement, Montant) values (paied, log, id, mois, methode, montant);
		insert into cheque (RefPaiement, Banque, NumeroCheque) values (paied, bnq, NumeroCheque);
		if (SELECT date_add(c.Au, INTERVAL 1 month) FROM calendrier c, paiement p where c.RefPaiement = p.RefPaiement AND p.RefLogement = RefLogement order by c.RefCalendrier DESC LIMIT 1)
			insert INTO calendrier (RefPaiement, Du, Au) VALUES (RefPaiement, '2021-09-09', date_add('2021-09-09', INTERVAL NbrMois month));
		ELSE
			insert INTO calendrier (RefPaiement, Du, Au) VALUES (RefPaiemant, '2021-09-09', date_add('2021-09-09', INTERVAL NbrMois month));
	END $$
DELIMITER ;


SELECT p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque 
from compte co, cheque c right JOIN 
paiement p on c.RefPaiement = p.RefPaiement 
INNER JOIN calendrier cal on cal.RefPaiement = p.RefPaiement 
WHERE co.Role = 'Copropri�taire' AND 
co.NumCompte IN (SELECT NumCompteCop from logement) 
and p.RefLogement in (SELECT RefLogement FROM logement) ORDER by p.RefPaiement DESC	


	select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque  from compte co, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement

	select p.RefPaiement, p.RefLogement, co.NomCompte, co.PrenomCompte, p.datePaiement, p.NbrMois, p.MethodePaiement, p.Montant, cal.Du, cal.Au, c.NumeroCheque, c.Banque  from compte co, calendrier cal, cheque c right join paiement p on c.RefPaiement = p.RefPaiement where co.NumCompte in (select l.NumCompteCop from logement l where l.RefLogement = p.RefLogement) and cal.RefPaiement = p.RefPaiement  ORDER BY p.RefPaiement DESC;



