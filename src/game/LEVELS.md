# 2SaveTheWorld


## Level 1 - public properties (x, y, color)


#### Storyline 

> The planet \_\_name\_\_ is  
>
>Disaster has struck the planet {name}.
>
> Pollution has destroyed all the trees and plants on the planet.
>
> Radiation has....
>
> Brave adventurer, you must help {hero} journey to the city and find out ....
>
> Learn Python programming and guide {hero} on his quest.


- 1.1 Setting public properties (one object) 

*Story: Move block to the right place to fill a gap*

```
block.x = 10 
```
 
---
<br/>
<br/>

- 1.2 Setting public properties (one object) 

*Story: Move block to the right place to fill a gap*

```
block.x = 5 
block.y = 6
```|||

---
<br/>
<br/>

- 1.3 Setting public properties (multiple objects) 

*Story: Move blocks to the right places with the right color*


```
block_a.x = 5 
block_a.y = 6
block_a.color = "red"  
block_b.x = 3 
block_b.y = 8
block_b.color = "green"
``` 

---
<br/>
<br/>

- 1.4 Using arithmetic to change properties of one object 

*Story: Move blocks to the right places *
 
```
block_a.x = block_a.x + 1 
block_a.y = block_a.y + 2 
```
 
---
<br/>
<br/>



- 1.5 Using arithmetic to change properties (multiple objects and arithmetic) 

*Story:Move blocks to the right places *
```
block0.x = block0.x - 2 
block0.y = block1.y + 1 
block1.x = block1.x + 3 
block1.y = block1.y - 4 
```
---
<br/>
<br/>

- 1.6 Setting public properties - using other objects' properties and arithmetic

*Story: Eg. Make a specific pattern to unlock the door*

```
block_a.x = something.x
block_a.y = something.y - 2 
block_b.x = something.x + 2 
block_b.y = something.y 
block_a.color = something.color
block_b.color = something.color
```
---
<br/>
<br/>
<br/>

- 1.7 Repeat previous for practice 

---
<br/>

- 1.8 Array access operators. `blocks` is a list of blocks. 

*Story: Move blocks to the right places*
 
```
blocks[0].x = 4 
blocks[0].y = 8 
blocks[1].x = 1 
blocks[1].y = 9 
blocks[2].x = 1 
blocks[2].y = 9
``` 

 ---------
 <br/>
 <br/>
 <br/>

 

 

- 1.9 Array access and setting properties based on another object 

 *Story:  Make a specific pattern to unlock the door* 

```
blocks[0].x = something.x 
blocks[0].y = something.y + 2 
blocks[1].x = something.x - 1 
blocks[1].y = something.y - 3 
blocks[2].x = something.x
blocks[2].y = something.y + 3 

block_a.color = something.color
block_b.color = something.color

```
 
 ---------
 
<br/>
<br/>
<br/>
 

 


 

 
Level 2 - Basic iterating
===

start with block[0].y = 6, block[1.y = 6, block[2].y = 6, block[3].y = 6, block[4].y = 6... etc?

- 2.1 Loop over a list and set public properties of all objects

```
for block in blocks:
    block.y = 6
```


- 2.2 Loop over a list (multiple properties)

```
for block in blocks:
    block.x = 8
    block.color = "red"
```



- 2.3 Loop over a list (multiple properties including 'value')

```
for block in blocks:
    block.x = 4
    block.color = "green"
    block.value = 3
```


- 2.4 Loop over a list (using arithmetic)

```
for block in blocks:
    block.value = block.value + 3
```


- 2.5 Loop over a list (using another object)

```
for block in blocks:
    block.x = something.x
    block.value = block.value + 1
```



- 2.6 Loop over a list (misc)

```
for block in blocks:
    block.value = block.value * 3
    block.color = "blue"
```





- 2.7 Loop over a list (misc)

```
for block in blocks:
    block.color = something.color
    block.y = something.y
```





- 2.8 Loop over a list (misc)

```
for block in blocks:
    block.color = something.color
    block.value = something.value + 1
```



- 2.9 Loop over a list (using a variable)

```
total = 0
for block in blocks:
    total = total + block.value
print(total)
```


- 2.10 Loop over a list (using a variable)

```
total = 0
for block in blocks:
    total = total * block.value
something.value = total
```

- 2.11 A few more examples (similar)

- 2.12 Loop over a list

```
for block in blocks:
    block.x = block.y
```


- 2.13 Loop over a list

```
for block in blocks:
    block.x = block.value + 1
```

- 2.14 flip some switches in a certain range

```
for i in range(3:5):
    block[i].color = "red"
```
 


IDEA: counting frequency using a dictionary 




Level 3 - using if, else, <, >,<=, >=, elif, ==
===

- 3.1 Make all red ones green


```
for block in blocks:
    if block.color == "red":
        block.color = "green
```

- 3.2 Move all green ones left

```
for block in blocks:
    if block.color == "green":
        block.x = block.x - 2
```

- 3.3 Make all blocks on the left red

```
for block in blocks:
    if block.x <= 6:
        block.color = "red"
```


- 3.4 blocks that have a value greater than 5 should all be yellow

```
for block in blocks:
    if block.value > 5:
        block.color = "yellow"
```


- 3.5 Red blocks on left, green ones on the right - using elif

```
for block in blocks:
    if block.color == "red":
        block.x = 1
    elif block.color == "green"
        block.x = 10
        
```

- 3.6 Repeat puzzle - using elif

- 3.7 Use elif and else


```
for block in blocks:
    if block.value <= 4:
        block.color = "red"
    elif ...
    else
```

- 3.8 Repeat puzzle - using elif and else


- 3.9 Using and and or

```
for block in blocks:
    if block.value <= 6 and block.color == "red":
        block.x = 10
```

- 3.10 Using and and or

```
for block in blocks:
    if block.value <= 6 or block.color == "red":
        block.x = 10
```

- 3.11 Using and and or with elif

```
for block in blocks:
    if block.value <= 6 or block.color == "red":
        block.x = 10
    elif block.value >= 6 and block.color == "green":
        block.y = 10
```


- 3.12 Repeat puzzle - using elif and else with and and or





Level 4 - methods of objects
===

 - 4.1 switches can be flipped
 
 
```
switch.flip()
```
 
*Story - open a door*


 - 4.2 flip all switches
 
 
```
for switch in switches:
    switch.flip()
```
 
*Story - open a door*





- 4.3 flip some switches to open the closed doors

```
for switch in switches:
    if switch.is_on():
        switch.flip()
```
 
*Story - open the closed doors so you can proceed




- 4.4 flip some switches to close the open doors

```
for switch in switches:
    if not switch.is_on():
        switch.flip()
```
 
*Story - close the doors, letting you walk across them


- 4.5 flip some switches in a certain range

```
for i in range(3:5):
    switches[i].flip()
```
 
 
 
 
- 4.6 Repeat previous puzzle. With moving blocks too

```
for i in range(3:5):
    blocks[i].color = "red"
```
 
 
 
- 4.7 pistons can be pushed - methods that take arguments

```
piston.push(5)
```


- 4.8 pistons can be pushed

```
for piston in pistons:
    piston.push(5)
```


```
for i in range(3:5):
    piston[i].push(2)
```







- 4.9 lasers can be fired
```
laser.fire()
```


- 4.10 lasers can be targeted
```
laser.target(block)
```

- 4.11 lasers can be targeted
```
for block in blocks:
    laser.target(block)
    laser.fire()
```


- 4.12 lasers can be targeted
```
for block in blocks:
    if block.color is "red":
        laser.target(block)
        laser.fire()
```




- 4.13 lasers can be targeted
```
for block in blocks:
    if block.color is "red" or block.value >= 10:
        laser.target(block)
        laser.fire()
```




- 4.14 lasers can be targeted
```
for block in blocks:
    if block.color is "red" or block.color == "green":
        laser.target(block)
        while block.value >= 1:
            laser.fire() # reduce value by 1 each time. At 0 it explodes
```




```
energy = 10
while energy >= 0:
    # something
```





Level 6 - functions 
===

def 


drone.move_left()
drone.water(5)
drone.light(7)
drone.something(water=7, light = 5)

def treat():
    

 
while (water < 5 ):
    elephant.spray_at(...)
}
	

