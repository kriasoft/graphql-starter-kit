/**
 * GraphQL Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2016-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Viewer', () => {
  it('.me must be null if user is not authenticated', (done) => {
    chai.request(server)
      .post('/')
      .send({ query: 'query { viewer { me { id, email } } }' })
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.deep.equal({ data: { viewer: { me: null } } });
        done();
      });
  });
});
