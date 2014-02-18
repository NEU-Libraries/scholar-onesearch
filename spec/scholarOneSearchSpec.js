var errorThrown = new Function();
jasmine.getFixtures().fixturesPath = '';
describe('scholarOneSearch is the primo enacapsulated JS for Northeastern University libraries', function(){
  describe('permaUrls adds a link to each searchresult', function(){

      beforeEach(function(){
        var $body = $('body')
        $body.load('http://onesearch-test.northeastern.edu/primo_library/libweb/action/search.do?fn=search&ct=search&initialSearch=true&mode=Basic&tab=default_tab&indx=1&dum=true&srt=rank&vid=NUdev&frbg=&vl%28freeText0%29=science&scp.scps=scope%3A%28NEU%29%2Cprimo_central_multiple_fe');
      });
      it('shouldLoad test to see if there are search results to add a link to', function(){


      });
  });


});
