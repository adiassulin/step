// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;
import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;

import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*; 

/** Servlet that returns the city ranking*/
@WebServlet("/favorite-city-data")
public class FavoriteCityServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query("Survay");
    PreparedQuery results = datastore.prepare(query);

    LinkedHashMap<String, Integer> favCity = new LinkedHashMap<>();
    for (Entity island : results.asIterable()) {
        favCity.put((String) island.getProperty("name"), (int) island.getProperty("score"));
    }

    response.setContentType("application/json");
    Gson gson = new Gson();
    String json = gson.toJson(favCity);
    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String isle = request.getParameter("island");
    boolean changed = false;

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    Query query = new Query("Survay");
    PreparedQuery results = datastore.prepare(query);

    for (Entity island : results.asIterable()) {
      if (((String)island.getProperty("name")).equals(isle))
      {
          changed = true;
          island.setProperty("score", (int)island.getProperty("score") + 1);
          datastore.put(island);
      }
    }

    if (!changed)
    {
      Entity entity = new Entity("Survay");
      entity.setProperty("name", isle);
      entity.setProperty("score", 1);
    }
    //redirect
    response.sendRedirect("/index.html");
  }
}

