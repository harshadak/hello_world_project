# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render, HttpResponse, redirect
from django.contrib import messages
from models import *
# Create your views here.

def index( request ):
    return render(request, "HelloWorld/index.html")

def login(request):
    return render(request, "HelloWorld/login.html")

def registration(request):
    return render(request, "HelloWorld/registration.html")

def add(request):
    count=0
    if len(request.POST['first_name_form'])<2:
        messages.add_message(request,messages.INFO,'First Name field is too short')
        count=1
    if len(request.POST['last_name_form'])<2:
        messages.add_message(request,messages.INFO,'Last Name field is too short')
        count=1
    if request.POST["pass_form"]!=request.POST["conf_form"]:
        messages.add_message(request,messages.INFO,'password does not match')
        count=1
    if len(request.POST["conf_form"])<8:
        messages.add_message(request,messages.INFO,'password needs to be at least 8 characters long')
        count=1

    if count==1:
        return redirect('/registration')    

    Users.objects.create(
    first_name=request.POST['first_name_form'],
    last_name=request.POST['last_name_form'],
    email=request.POST['email_form'],
    password=request.POST['conf_form']
    )
    request.session['id']=Users.objects.last().id
    request.session['fname']=Users.objects.get(id=request.session['id']).first_name
    return redirect("/")

def logout(request):
    del request.session['id']
    return redirect('/')

def log_in(request):
    user =Users.objects.filter(email=request.POST['email_form'])
    if len(user) and user[0].password==request.POST['password_form'] :
        request.session['id'] = user[0].id
        request.session['fname'] = user[0].first_name
        return redirect('/')
    else:
        return redirect('/login')
	return redirect('/login')

def search(request):
    request.session['search_result']=request.POST['search_form']
    request.session['skills_result']=request.POST['skills_form']
    request.session['city_result']=request.POST['city_form']
    request.session['state_result']=request.POST['state_form']
    #print request.session['skills_result']
    count=0
    if len(request.POST['state_form']) == 0:
        messages.add_message(request,messages.INFO,'Please enter the state')
        count=1
    if count==1:
        return redirect('/')
    return redirect('/')

def save(request):
    if 'id' in request.session:
        Jobs.objects.create(url = request.POST['url'],list_date = request.POST['date'], company = request.POST['company'], location = request.POST['save_location'], title = request.POST['title'],user = Users.objects.get(id=request.session['id']))
    return redirect('/')

def show(request):
    context = {
        "list_jobs": Users.objects.get(id=request.session['id']).jobs.all()
    }
    return render(request, "HelloWorld/show.html",context)
def remove(request):
    print request.POST['remove_job']
    Jobs.objects.get(id=request.POST['remove_job']).delete()
    return redirect("/show")
