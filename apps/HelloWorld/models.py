
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import re
from django.db import models

class Users(models.Model):
	first_name = models.CharField(max_length=255) 
	last_name = models.CharField(max_length=255)
	email = models.CharField(max_length=255)
	password= models.CharField(max_length=255)
	created_at = models.DateTimeField(auto_now_add = True) 
	updated_at = models.DateTimeField(auto_now = True)

class Jobs(models.Model):
	url = models.CharField(max_length=255)
	list_date= models.DateTimeField()
	company = models.CharField(max_length=255)
	location = models.CharField(max_length=255)
	title = models.CharField(max_length=255)
	user = models.ForeignKey(Users, related_name = "jobs")
	created_at = models.DateTimeField(auto_now_add = True) 
	updated_at = models.DateTimeField(auto_now = True)