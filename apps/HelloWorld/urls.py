from django.conf.urls import url, include
from . import views

urlpatterns = [
    url( r'^$' , views.index , name="index" ),
    url( r'^login$' , views.login , name="login" ),
    url( r'^registration$' , views.registration , name="registration" ),
    url( r'^add$' , views.add , name="add" ),
    url( r'^logout$' , views.logout , name="logout" ),
    url( r'^log_in$' , views.log_in , name="login" ),
    url( r'^search$' , views.search , name="search" ),
    url( r'^save$' , views.save , name="save" ),
    url( r'^show$' , views.show , name="show" ),
    url( r'^remove$' , views.remove , name="remove" )
]