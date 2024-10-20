
rm(list=ls())

library(lme4); library(lmerTest)
ci = function(x, a=qnorm(.975), na.rm=T) plotrix::std.error(x, na.rm=na.rm) * a
tab_mod = sjPlot::tab_model


  
# Load and clean ----------------------------------------------------------
dat = read.csv('C:/Users/ziqif/Desktop/OttoLab/SunkCost//all_data_final_2.csv', fileEncoding = "UTF-8-BOM")

files = paste0('data/', list.files('data/', pattern = '.csv'))
dat   = do.call(plyr::rbind.fill, lapply(files, read.csv))

# trim the fat
dat = dat[tolower(dat$is_data_trial)=='true', ]
dat = dat[!is.na(dat$subject),]

# remove unfinished subjs
npersub = table(dat$subject)
rmv = names(npersub[npersub < 150])
dat = dat[!dat$subject %in% rmv, ]

# get descriptives
N    = length(unique(dat$subject))
mage = mean(as.numeric(dat$age), na.rm=T)
sage = sd(as.numeric(dat$age), na.rm=T)
pfem = mean(grepl('f|w', tolower(dat$gender)))

cat('N = ',N,'\nMean age = ', mage,' ( SD = ',sage,')\n',pfem*100,'% women',sep = '' )


# seperate catch from true trials
table(dat$condition, dat$catch, dat$subject)[,,1]
catch = dat[dat$catch==1,]
dat   = dat[dat$catch==0,]

# no_prior has no invest2, so have to take invest1 instead
# awkward code, but gets the job done...
# the idea is that if there is no tail number, it's the var of interest
{
  dat$invest = ifelse(dat$condition=='no_prior', dat$invest_choice1, dat$invest_choice2)
  dat$effort = ifelse(dat$condition=='no_prior', dat$effort1, dat$effort2)
  dat$pwin   = ifelse(dat$condition=='no_prior', dat$success_possibility1, dat$success_possibility2)
}


# Compute variables for models
dat$invest         = ifelse(dat$invest=='null', NA, as.numeric(dat$invest=='y'))
dat$math_rt1       = as.numeric(dat$math_rt1)/1000
dat$math_acc1      = ifelse(dat$math_accuracy1 =='null', NA, as.numeric(dat$math_accuracy1=='TRUE'))
dat$log_math_rt    = log(dat$math_rt1)
dat$effort1_c      = ifelse(dat$effort1==3, -.5, .5)
dat$pwin1          = dat$success_possibility1
dat$pwin1_c        = (dat$pwin1 - median(dat$pwin1))/10
dat$condition_f    = factor(dat$condition, levels = c('no_prior','low_prior','high_prior'))
dat$effort_c       = ifelse(dat$effort==3, -.5, .5) 
dat$pwin_c         = (dat$pwin - median(unique(dat$pwin)))/10

x = dat[dat$subject==dat$subject[1],]
z = table(x$success_possibility1, x$success_possibility2, x$effort1, x$effort2, x$condition)


median(tapply(dat$time_elapsed, dat$subject, max)/1000/60)



# Catch performance -------------------------------------------------------
catch$invest = ifelse(catch$invest_choice1=='null', NA,
                      as.numeric(catch$invest_choice1=='y'))

pinv = tapply(catch$invest, list(catch$subject, catch$effort1), mean, na.rm=T)

pdf('figs/pinv_catch.pdf', 6, 6)
barplot(pinv, beside=T, ylab='P(Accept Catch)', xlab='Effort Level')
abline(h=2/3, lty=2)
dev.off()

# rmv subjs
rmv  = rownames(pinv)[rowMeans(pinv, na.rm=T)>.66]
dat  = dat[!dat$subject %in% rmv, ]

cat('\nNumber of subject removed for failing catch trials = ',length(rmv), '\n')
cat('\nRemaining subjects = ',length(unique(dat$subject)), '\n')

# Timeouts ----------------------------------------------------------------

dat$timeout = as.numeric(dat$invest_timedout1==T) + 
              as.numeric(dat$invest_timedout2==T) + 
              as.numeric(dat$math_timedout1==T)   + 
              as.numeric(dat$math_timedout2==T) 
dat$timeout = as.numeric(dat$timeout>=1)

pdf('figs/ptimeouts.pdf', 6, 6)
pto = tapply(dat$timeout, dat$subject, mean)
hist(pto, xlab='P(Timeout)', main='')
abline(v=.2,lty=2)
dev.off()

# remove subjects with more than 20% timeouts
rmv = names(pto[pto>=.2])
dat = dat[!dat$subject %in% rmv, ]

cat('\nNumber of subject removed for too many timeouts = ',length(rmv), '\n')
cat('\nRemaining subjects = ',length(unique(dat$subject)), '\n')


# remove timeout trials
dat = dat[dat$timeout==0,]

# final quest set
qnames = c(colnames(dat)[grepl('NFC',colnames(dat))],
           colnames(dat)[grepl('UPPS',colnames(dat))],
           colnames(dat)[grepl('WQ',colnames(dat))])

quest  = as.data.frame(dat[,c('subject', qnames)])
quest  = quest[!duplicated(quest$subject), ]

# Performance ---------------------------------------------------
## RT ----------------------------------------------------------------------

# Visualize
pdf('figs/rt_math1_barplot_u.pdf', 6, 6)

mrt = tapply(dat$math_rt1, list(dat$pwin1, dat$effort1), mean, na.rm=T)
ert = tapply(dat$math_rt1, list(dat$pwin1, dat$effort1), ci)
ylm = range(pretty(c(mrt-ert, mrt+ert+.1)))

b = barplot(mrt, beside=T, xlab='Effort Level', ylim=ylm, xpd=F, 
            ylab='Avg. RT (s.)', 
            legend.text = T,
            args.legend = list(x='topright', bty='n', title='% Success'))
arrows(b, mrt-ert, b, mrt+ert, length=0)

dev.off()

# Model
rt_mod = lmer(log_math_rt ~ effort1_c * pwin1_c + (1|subject), 
              data=dat)
tab_mod(rt_mod, file='C:/Users/ziqif/Desktop/OttoLab/SunkCost/sunkcost-online/data_output/rt_lmer.html')



## Acc ---------------------------------------------------------------------

# Visualize
pdf('figs/acc_math1_barplot.pdf', 6, 6)

macc = tapply(dat$math_acc1, list(dat$pwin1, dat$effort1), mean, na.rm=T)
eacc = tapply(dat$math_acc1, list(dat$pwin1, dat$effort1), ci)
ylm = c(0.5,1.1)

b = barplot(macc, beside=T, xlab='Effort Level', ylim=ylm, xpd=F, 
            ylab='P(Correct)', 
            legend.text = T,
            args.legend = list(x='topright', bty='n', title='% Success', ncol=3))
arrows(b, macc-eacc, b, macc+eacc, length=0)

dev.off()

# Model
acc_mod = glmer(math_acc1 ~ effort1_c * pwin1_c + (effort1_c|subject), 
                data=dat, family='binomial')
tab_mod(acc_mod, transform=NULL, file='C:/Users/ziqif/Desktop/OttoLab/SunkCost/sunkcost-online/data_output/acc_glmer.html')


# Invest ------------------------------------------------------------------

# Visualize
pinv = tapply(dat$invest, list(dat$pwin, dat$effort, dat$condition), mean, na.rm=T)
einv = tapply(dat$invest, list(dat$pwin, dat$effort, dat$condition), ci, na.rm=T)
ylm = c(0,1.2)
titles = list('no_prior'='No Prior Investment',
              'low_prior'='Low Prior Investment', 
              'high_prior' = 'High Prior Investment')

for(i in 1:dim(pinv)[3]) {
  pdf(paste0('C:/Users/ziqif/Desktop/OttoLab/SunkCost/sunkcost-online/data_output/pinv_barplot_', dimnames(pinv)[[3]][i], '.pdf'), 6, 6)
  b = barplot(pinv[,,i], beside=T,
              xlab='Effort Level', ylab='P(Invest)',
              main=titles[[dimnames(pinv)[[3]][i]]],
              ylim=ylm, xpd=F, yaxt='n',
              legend.text = T,
              args.legend = list(x='topleft', bty='n', title='% Success', ncol=3))
  axis(2, at=c(0,.5,1))
  arrows(b, pinv[,,i]-einv[,,i], b, pinv[,,i]+einv[,,i], length=0)
  dev.off()
}



# Model
inv_mod = glmer(invest ~ condition_f * effort_c * pwin_c + (1|subject), 
                data=dat, family='binomial', nAGQ = 0)
tab_mod(inv_mod, transform=NULL, file='C:/Users/ziqif/Desktop/OttoLab/SunkCost/sunkcost-online/data_output/inv_glmer_trial.html')

### Bayesian model to compare low vs. high prior ------
library(brms)
install.packages("bayestestR")
library(installr)
installr::install.TBB()
library(bayestestR)


options(mc.cores=3)
install.packages("StanHeaders", repos = c("https://mc-stan.org/r-packages/", getOption("repos")))
remove.packages("rstan")
if (file.exists(".RData")) file.remove(".RData")
install.packages("rstan", repos = "https://cloud.r-project.org/", dependencies = TRUE)
example(stan_model, package = "rstan", run.dontrun = TRUE)
# we recommend running this is a fresh R session or restarting your current session
install.packages("cmdstanr", repos = c("https://mc-stan.org/r-packages/", getOption("repos")))
Sys.getenv("BINPREF")
dotR <- file.path(Sys.getenv("HOME"), ".R")
if (!file.exists(dotR)) dir.create(dotR)
M <- file.path(dotR, "Makevars.win")
if (!file.exists(M)) file.create(M)
cat("\n CXX14FLAGS += -mtune=native -O3 -mmmx -msse -msse2 -msse3 -mssse3 -msse4.1 -msse4.2",
    file = M, sep = "\n", append = FALSE)
remove.packages("rstan")
if (file.exists(".RData")) file.remove(".RData")
Sys.getenv("BINPREF")
readLines("~/.Rprofile")
install.packages("StanHeaders", repos = c("https://mc-stan.org/r-packages/", getOption("repos")))
install.packages("rstan", repos = c("https://mc-stan.org/r-packages/", getOption("repos")))
Sys.setenv(MAKEFLAGS = "-j4") # four cores used
install.packages("rstan", type = "source")
example(stan_model, package = "rstan", run.dontrun = TRUE)
install.packages("rstan", repos = c("https://mc-stan.org/r-packages/", getOption("repos")))

inv_mod_b = brm(invest ~ condition_f * effort_c * pwin_c + (1|subject),
                 data=dat, family='bernoulli',
                 chains = 3, 
                 iter = 5000, 
                 warmup = 2000)
 saveRDS(inv_mod_b, 'C:/Users/ziqif/Desktop/OttoLab/SunkCost/sunkcost-online/data_output/inv_mod_b.rds')

inv_mod_b = readRDS('C:/Users/ziqif/Desktop/OttoLab/SunkCost/sunkcost-online/data_output/inv_mod_b.rds')

# compare low vs. high prior effect
post = as.data.frame(inv_mod_b)
post = post[,c('b_condition_flow_prior','b_condition_fhigh_prior')]

dens_low     = density(post[,1])
dens_low$y0  = dens_low$y/max(dens_low$y)
dens_high    = density(post[,2])
dens_high$y0 = dens_high$y/max(dens_high$y)
xlim = c(min(c(dens_low$x, dens_high$x))-.1, max(c(dens_low$x, dens_high$x))+.1)

pdf('figs/pinv_lowhigh_bayes_dens.pdf', 6, 6)

plot(dens_low$x, dens_low$y0, xlim=xlim, type='l',
     xlab=expression(beta), ylab='Normalized Density')
polygon(c(dens_low$x, rev(dens_low$x)), 
          c(dens_low$y0, rep(0, length(dens_low$y0))), 
        col=scales::alpha('blue',.2))
lines(dens_high$x, dens_high$y0)
polygon(c(dens_high$x, rev(dens_high$x)), 
        c(dens_high$y0, rep(0, length(dens_high$y0))), 
        col=scales::alpha('red',.2))
legend('topright', bty='n', fill=scales::alpha(c('blue','red'),.2), 
       legend=c('Low Prior','High Prior'))

pval = mean(post[,1] > post[,2])
legend('right',bty='n',legend=paste0('P(LP > HP) = ',round(pval,2)))
  
dev.off()

# Questionnaire -----------------------------------------------------------

## Compute summary questionnaire scores ------

# nfc 
nfcidx  = grepl('NFC',colnames(quest))
nfc     = quest[, nfcidx] + 1 # 1-5, not 0-4
nfc$NFC3 = 6- nfc$NFC3
nfc$NFC4 = 6- nfc$NFC4
nfc$NFC5 = 6- nfc$NFC5
nfc$NFC7 = 6- nfc$NFC7
nfc$NFC8 = 6- nfc$NFC8
nfc$NFC9 = 6- nfc$NFC9
nfc$NFC12 = 6- nfc$NFC12
nfc$NFC16 = 6- nfc$NFC16
nfc$NFC17 = 6- nfc$NFC17

nfc_sum = rowSums(nfc)

# upps
uppsidx = grepl('UPPSP',colnames(quest))
upps    = quest[, uppsidx] + 1 # 1-4, not 0-3
# https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6442540/#SM1
upps$UPPSP3 = 5 - upps$UPPSP3
upps$UPPSP6 = 5 - upps$UPPSP6
upps$UPPSP8 = 5 - upps$UPPSP8
upps$UPPSP9 = 5 - upps$UPPSP9
upps$UPPSP10 = 5 - upps$UPPSP10
upps$UPPSP13 = 5 - upps$UPPSP13
upps$UPPSP14 = 5 - upps$UPPSP14
upps$UPPSP15 = 5 - upps$UPPSP15
upps$UPPSP16 = 5 - upps$UPPSP16
upps$UPPSP17 = 5 - upps$UPPSP17
upps$UPPSP18 = 5 - upps$UPPSP18
upps$UPPSP20 = 5 - upps$UPPSP20
subscales = list('NU'=c(4,7,12,17), 
                 'PU'=c(2,10,15,20), 
                 'SS'=c(3,9,14,18),
                 'PR'=c(1,6,13,19),
                 'PE'=c(5,8,11,16))
upps_sum = sapply(subscales, function(x) rowSums(upps[,x]))

# WQ
wqidx  = grepl('WQ',colnames(quest))
wq    = quest[, wqidx] + 1 # 1-11, not 0-10
wq$WQ4 = 12 - wq$WQ4
wq$WQ5 = 12 - wq$WQ5
subscales_wq = list('SC'=c(1,4,6,8), 
                 'PU'=c(2,3,5,7))

wq_sum = sapply(subscales_wq, function(x) rowSums(wq[,x]))

## Correlations between questionnaires ------
mat = cbind(nfc_sum, wq_sum, upps_sum)
colnames(mat) = c('NFC', 'WQ_SC', 'WQ_PU',
                  'UPPS_NU', 'UPPS_PU', 'UPPS_SS','UPPS_PR','UPPS_PE')
pdf('figs/quest_corrs.pdf', 8, 8)
psych::pairs.panels(mat, smooth=F, ellipses=F, lm=T)
dev.off()

## Correlation to performance -----
mat = as.data.frame(mat)
mat$subject = quest$subject

# rt
cor = dat[dat$math_acc1==1,]
mrt = tapply(cor$math_rt1, list(cor$subject, cor$effort1), mean, na.rm=T)
drt = mrt[,2] - mrt[,1]
mat$drt = drt[mat$subject]

pdf('figs/quest_rt_cor.pdf',8,5)
layout(matrix(1:8, 2, 4, byrow=T))
for(i in 1:(ncol(mat)-2)) {
  
  plot(mat[,i], mat[,'drt'], 
       main=colnames(mat)[i], 
       xlab='',
       ylab=expression(Delta~"Correct RT (4-3)"), 
       pch=21,bg='grey', ylim=c(-1,1))
  abline(lm(mat[,'drt'] ~ mat[,i]), col='red', lwd=3)
  
  # add cor text
  r = cor.test(mat[,i], mat[,'drt'])
  legend('bottomright', bty='n', 
         legend=paste0('r = ', round(r$estimate,2),'\n', 
                       'p = ', round(r$p.value, 4)))
  
  
}
dev.off()

# acc
macc = tapply(dat$math_acc1, list(dat$subject, dat$effort1), mean, na.rm=T)
dacc = macc[,2] - macc[,1]
mat$dacc = dacc[mat$subject]

pdf('figs/quest_acc_cor.pdf',8,5)
layout(matrix(1:8, 2, 4, byrow=T))
for(i in 1:(ncol(mat)-3)) {
  
  plot(mat[,i], mat[,'dacc'], 
       main=colnames(mat)[i], 
       xlab='',
       ylab=expression(Delta~"P(Correct) (4-3)"), 
       pch=21,bg='grey', ylim=c(-.5,.5))
  abline(lm(mat[,'dacc'] ~ mat[,i]), col='red', lwd=3)
  
  # add cor text
  r = cor.test(mat[,i], mat[,'dacc'])
  legend('bottomright', bty='n', 
         legend=paste0('r = ', round(r$estimate,2),'\n', 
                       'p = ', round(r$p.value, 4)))
}
dev.off()

# invest
minv = tapply(dat$invest, list(dat$subject, dat$condition), mean, na.rm=T)
dinv = minv[,3] - minv[,2]
mat$dinv = dinv[mat$subject]

pdf('figs/quest_inv_cor.pdf',8,5)
layout(matrix(1:8, 2, 4, byrow=T))
for(i in 1:(ncol(mat)-4)) {
  
  plot(mat[,i], mat[,'dinv'], 
       main=colnames(mat)[i], 
       xlab='',
       ylab=expression(Delta~"P(Invest) (Low Prior-No Prior)"), 
       pch=21,bg='grey', ylim=c(-1, .5))
  abline(lm(mat[,'dinv'] ~ mat[,i]), col='red', lwd=3)
  abline(h=0,lwd=2)
  
  # add cor text
  r = cor.test(mat[,i], mat[,'dinv'])
  legend('topright', bty='n', 
         legend=paste0('r = ', round(r$estimate,2),'\n', 
                       'p = ', round(r$p.value, 4)))
  
}
dev.off()



