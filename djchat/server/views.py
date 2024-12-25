from django.db.models import Count
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Server
from .schema import server_list_docs
from .serializer import ServerSerializer


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()
    # permission_classes = [IsAuthenticated]

    @server_list_docs
    def list(self, request):
        """Retrieve and filter a list of servers based on query parameters.

    This method handles GET requests to list servers, supporting dynamic filtering 
    and annotation based on client-provided query parameters. Filters can include 
    server category, user-specific servers, server ID, and the option to return the 
    number of members in each server.

    The method supports paginated or limited responses by specifying a quantity, 
    and it ensures that sensitive filters (such as filtering by user or specific server ID) 
    require user authentication.

    Query Parameters:
        category (str, optional): Filters servers by category name. Only servers belonging 
            to the specified category will be returned.
        qty (str, optional): Limits the number of servers returned. The value should be an 
            integer representing the desired maximum number of servers in the response.
        by_user (str, optional): Filters servers by the current user's membership. If set to 
            'true', only servers where the authenticated user is a member will be included.
        by_serverid (str, optional): Filters the response to include only the server with 
            the specified ID. This parameter is mutually inclusive with authentication.
        with_num_members (str, optional): If 'true', annotates each server with the count 
            of its members under the key `num_members`. 

    Behavior:
        - If no filters are provided, the method returns all available servers.
        - Multiple filters can be applied simultaneously.
        - Annotations (such as member count) are optional and controlled by the `with_num_members` flag.
        - If both `by_user` and `by_serverid` are specified, they will be combined in the query.

    Authentication:
        - Filtering by `by_user` or `by_serverid` requires the user to be authenticated.
        - If the user is unauthenticated and attempts to apply these filters, an 
          AuthenticationFailed exception is raised.

    Error Handling:
        - If a server ID is specified (`by_serverid`) but does not correspond to any server, 
          a ValidationError is raised with a detailed error message.
        - If the provided server ID cannot be parsed (e.g., non-integer values), 
          a ValidationError is triggered to notify the client of the input error.

    Returns:
        Response: A paginated or limited list of servers serialized using `ServerSerializer`. 
        The response includes standard server details, and if `with_num_members` is set, 
        the number of members for each server is added to the output.

    Example:
        Request:
            GET /api/servers/?category=gaming&by_user=true&with_num_members=true
        Response:
            [
                {
                    "id": 1,
                    "name": "Gaming Hub",
                    "category": "Gaming",
                    "num_members": 124
                },
                {
                    "id": 2,
                    "name": "Arcade Lounge",
                    "category": "Gaming",
                    "num_members": 89
                }
            ]
    """
        category = request.query_params.get("category")  # Filter by category name
        qty = request.query_params.get("qty")  # Limit number of results
        by_user = request.query_params.get("by_user") == "true"  # Filter by current user
        by_serverid = request.query_params.get("by_serverid")  # Filter by specific server ID
        with_num_members = request.query_params.get("with_num_members") == "true"  # Include member count
        

        if category:
            self.queryset = self.queryset.filter(category__name=category)
        
        if by_user:
            if by_user and request.user.is_authenticated:
                user_id = request.user.id
                self.queryset = self.queryset.filter(member=user_id)
            else:
                raise AuthenticationFailed()    

        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("member"))

        if by_serverid:
            try:
                self.queryset = self.queryset.filter(id=by_serverid)
                
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server with id {by_serverid} not found")
            
            except ValueError:
                raise ValidationError(detail="Server value error")    

        if qty:
            self.queryset = self.queryset[: int(qty)]

        serializer = ServerSerializer(
            self.queryset,
            many=True,
            context={"num_members": with_num_members}
        )        

        return Response(serializer.data)


        
